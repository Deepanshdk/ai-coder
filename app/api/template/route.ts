import { NextResponse } from 'next/server'
import {generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import { BASE_PROMPT} from "@/lib/prompts";
import {basePrompt as nodeBasePrompt} from "@/lib/defaults/node";
import {basePrompt as reactBasePrompt} from "@/lib/defaults/react";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()

        const response = await generateText({
            model: groq("llama3-70b-8192"),
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
            prompt: prompt,
        })

        const answer = response.text


        console.log(answer)

        if (answer === "react") {
            return NextResponse.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
        }

        if (answer === "node") {
            return NextResponse.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
        }

        return NextResponse.json({ message: "You cant access this" }, { status: 403 })
    } catch (error) {
        return NextResponse.json({ message: "Internal server error"+(error as Error).message }, { status: 500 })
    }
}
