import { NextResponse } from 'next/server'
import {generateText } from "ai";

import { groq } from "@ai-sdk/groq";

import { getSystemPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages as { role: "user" | "assistant", content: string }[]

    const response = await generateText({
      messages: messages,
      model: groq("deepseek-r1-distill-llama-70b"),
      system: getSystemPrompt(),
      maxTokens: 8000
    })

    return NextResponse.json({
      response: response.text
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
