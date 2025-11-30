import { NextResponse } from "next/server";
import { articles } from "../../../lib/articles";
import { projects } from "../../../lib/projects";
import { quizzes } from "../../../lib/quizzes";
import { chatCompletion, ChatMessage, ChatTool } from "../../../lib/openai";
import { recallMemory, saveMemory } from "../../../lib/memory";
import { performSafeSearch } from "../tools/search/route";

const NAVIGATOR_PROMPT = `You are the Robotics OS AI Navigator. Always respond with STRICT JSON using this structure:
{
  "ui_action": "NAVIGATE | UPDATE_LAYOUT | UPDATE_PATH | ASK_USER | IDLE",
  "ui_payload": {},
  "message": "",
  "personalization": {
    "recommended_articles": [],
    "recommended_quizzes": [],
    "next_step": {}
  },
  "path_update": { "path": [] }
}

Rules:
- Keep language encouraging and educational for middle school to early high school students.
- Never include profanity or unsafe electrical advice.
- Prioritize internal articles, quizzes, and projects before web search data.
- Only reference external links from the allowed domain list provided via the search tool.
- Prefer concise bullet points inside the "message" field when giving guidance.
- If unsure or missing info, set ui_action to "ASK_USER" and request the needed detail.
`;

type ToolHandler = ChatTool & {
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

async function handleToolCalls(
  initialMessage: ChatMessage | undefined,
  messages: ChatMessage[],
  tools: ToolHandler[],
  projectId: string
): Promise<ChatMessage | undefined> {
  let message = initialMessage;
  if (!message?.tool_calls?.length) return message;

  messages.push(message);

  for (const toolCall of message.tool_calls) {
    const tool = tools.find((t) => t.name === toolCall.function.name);
    if (!tool) continue;
    try {
      const args = toolCall.function.arguments
        ? (JSON.parse(toolCall.function.arguments) as Record<string, unknown>)
        : {};
      const result = await tool.handler({ ...args, projectId });
      messages.push({
        role: "tool",
        name: tool.name,
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    } catch (error) {
      messages.push({
        role: "tool",
        name: tool.name,
        tool_call_id: toolCall.id,
        content: JSON.stringify({ error: (error as Error).message }),
      });
    }
  }

  const followUp = await chatCompletion(messages, tools);
  message = followUp.choices[0]?.message;
  return message;
}

function normalizeResponse(raw: unknown) {
  const template = {
    ui_action: "IDLE",
    ui_payload: {},
    message: "",
    personalization: {
      recommended_articles: [] as string[],
      recommended_quizzes: [] as string[],
      next_step: {} as Record<string, unknown>,
    },
    path_update: { path: [] as string[] },
  };

  if (!raw || typeof raw !== "object") return template;
  return {
    ...template,
    ...(raw as Record<string, unknown>),
    personalization: {
      ...template.personalization,
      ...(raw as { personalization?: Record<string, unknown> }).personalization,
    },
    path_update: {
      ...template.path_update,
      ...(raw as { path_update?: Record<string, unknown> }).path_update,
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userMessage, projectId, userId, systemPrompt } = body as {
      userMessage?: string;
      projectId?: string;
      userId?: string;
      systemPrompt?: string;
    };

    if (!userMessage || !projectId) {
      return NextResponse.json(
        { error: "userMessage and projectId are required" },
        { status: 400 }
      );
    }

    const chosenPrompt = systemPrompt ?? NAVIGATOR_PROMPT;
    const callerId = userId ?? "anonymous";

    let recalledMemory: string[] = [];
    try {
      recalledMemory = await recallMemory(projectId, userMessage);
    } catch (error) {
      console.error("Memory recall failed", error);
    }

    const toolHandlers: ToolHandler[] = [
      {
        name: "search_web",
        description:
          "Perform a safe web search limited to approved robotics domains and sanitized snippets.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search phrase focused on robotics topics." },
          },
          required: ["query"],
        },
        handler: async ({ query }) => performSafeSearch(String(query ?? "")),
      },
      {
        name: "recall_memory",
        description: "Fetch project-specific memories using vector search.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "What to look up in saved context." },
          },
          required: ["query"],
        },
        handler: async ({ query }) => recallMemory(projectId, String(query ?? "")),
      },
    ];

    const toolDefs: ChatTool[] = toolHandlers.map(({ name, description, parameters }) => ({
      name,
      description,
      parameters,
    }));

    const context = {
      userMessage,
      projectId,
      internal_articles: articles,
      internal_quizzes: quizzes,
      internal_projects: projects,
      recalledMemory,
    };

    const messages: ChatMessage[] = [
      { role: "system", content: chosenPrompt },
      { role: "user", content: JSON.stringify(context) },
    ];

    const initialResponse = await chatCompletion(messages, toolDefs);
    let message = initialResponse.choices[0]?.message;

    message = await handleToolCalls(message, messages, toolHandlers, projectId);

    const content = message?.content ?? "";

    try {
      await saveMemory(callerId, projectId, userMessage);
      if (content) {
        await saveMemory(callerId, projectId, content);
      }
    } catch (error) {
      console.error("Failed to save memory", error);
    }

    let parsed: unknown = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { message: content };
    }

    const safeResponse = normalizeResponse(parsed);
    return NextResponse.json(safeResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
