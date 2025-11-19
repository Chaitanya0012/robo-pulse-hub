import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userAnswer, correctAnswer, explanation, mistakes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are a helpful robotics tutor. Your role is to help students understand their mistakes and learn from them in a supportive, encouraging way.

Guidelines:
- Be encouraging and positive
- Explain concepts clearly and simply
- Point out common misconceptions
- Provide practical examples
- Help students understand WHY they made the mistake, not just what the correct answer is`;

    let userPrompt = "";

    if (mistakes && mistakes.length > 0) {
      // Analyzing mistake patterns
      userPrompt = `The student has been struggling with these questions:

${mistakes.map((m: any, i: number) => `${i + 1}. Category: ${m.category}
   Times incorrect: ${m.incorrect_count}
   Question: ${m.quiz_questions?.question || 'N/A'}`).join('\n\n')}

Please analyze their mistake patterns and provide:
1. Common themes or concepts they're struggling with
2. Specific advice for each weak area
3. Study recommendations
4. Encouragement and actionable next steps

Keep it concise but helpful.`;
    } else {
      // Explaining a specific mistake
      userPrompt = `The student answered a robotics question incorrectly:

Question: ${question}
Their Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
Explanation: ${explanation}

Please help them understand:
1. Why their answer was incorrect
2. The correct reasoning
3. Common misconceptions about this topic
4. A practical tip to remember for next time

Be encouraging and supportive!`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway Error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const tutorResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: tutorResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-tutor function:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
