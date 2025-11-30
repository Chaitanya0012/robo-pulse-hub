import { NextRequest, NextResponse } from 'next/server'
import { recallMemory, saveMemory } from '../../../lib/memory'
import { getOpenAIClient } from '../../../lib/openai'
import { getSimulatorStateTool } from '../../../tools/getSimulatorState'
import { webSearchTool } from '../../../tools/webSearch'

const SYSTEM_PROMPT = `<<<SYSTEM_PROMPT_START>>>

You are “Project Navigator”, an expert AI project mentor.  
You understand the user, diagnose their proficiency, research their tools, create a custom plan, and guide them live while preventing mistakes.  
You output ONLY valid JSON with:
{
  "mode": "",
  "message": "",
  "questions": [],
  "analysis": {},
  "plan": [],
  "guidance": {}
}

Your modes:
- assessment_questions
- assessment_feedback
- project_plan
- live_guidance

guidance contains:
- warnings[]
- best_practices[]
- meta_cognition_prompts[]
- next_priority

Think like a robotics expert with experience in Arduino, ESP32, sensors, motors, robotics logic, simulators, PID, line followers, obstacle bots, arm robots, etc.

<<<SYSTEM_PROMPT_END>>>`

type NavigatorRequest = {
  userMessage: string
  projectId: string
  mode?: string
  userId?: string
}

type ToolHandler = {
  name: string
  handler: (args: any) => Promise<any>
  description: string
  parameters: Record<string, unknown>
}

const toolset: ToolHandler[] = [getSimulatorStateTool, webSearchTool]

function buildTools() {
  return toolset.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }))
}

async function executeToolCall(name: string, args: any) {
  const tool = toolset.find((item) => item.name === name)
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`)
  }
  return tool.handler(args)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NavigatorRequest
    const { userMessage, projectId, mode = 'live_guidance', userId = 'anonymous' } = body

    if (!userMessage || !projectId) {
      return NextResponse.json({ error: 'Missing userMessage or projectId' }, { status: 400 })
    }

    const client = getOpenAIClient()

    const memoryMatches = await recallMemory(projectId, userMessage)

    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'system',
        content: `Relevant project memory: ${JSON.stringify(memoryMatches ?? [])}`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ]

    const initialCompletion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: buildTools(),
      tool_choice: 'auto',
      temperature: 0.4,
    })

    const toolCalls = initialCompletion.choices[0].message.tool_calls
    const toolMessages: any[] = []

    if (toolCalls && toolCalls.length > 0) {
      for (const call of toolCalls) {
        const args = call.function.arguments ? JSON.parse(call.function.arguments) : {}
        const result = await executeToolCall(call.function.name, args)
        toolMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result),
        })
      }
    }

    const followUpMessages = [...messages]
    if (toolMessages.length > 0) {
      followUpMessages.push({
        role: 'assistant',
        tool_calls: toolCalls,
        content: null,
      })
      followUpMessages.push(...toolMessages)
    }

    if (mode) {
      followUpMessages.push({
        role: 'system',
        content: `Requested mode: ${mode}`,
      })
    }

    const finalCompletion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: followUpMessages,
      tools: buildTools(),
      temperature: 0.3,
    })

    const finalMessage = finalCompletion.choices[0].message.content || '{}'
    const navigatorJson = JSON.parse(finalMessage)

    await saveMemory(userId, projectId, userMessage)
    await saveMemory('assistant', projectId, finalMessage)

    return NextResponse.json({ navigator: navigatorJson, memories: memoryMatches })
  } catch (error) {
    console.error('Navigator error', error)
    return NextResponse.json({ error: 'Navigator failed' }, { status: 500 })
  }
}
