import { google } from "@ai-sdk/google"
import { streamText, tool } from "ai"
import { getTasks } from "@/app/actions/tasks"
import { z } from "zod"

export const runtime = "nodejs" // Use nodejs for MongoDB access if needed, though edge might work if it's hitting a serverless DB

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // 1. Fetch current tasks for context
    const taskResult = await getTasks()
    const currentTasks = taskResult.success ? taskResult.data : []

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system: `
        You are "Doable", a deeply intuitive and proactive AI Productivity Coach.
        
        CURRENT STATE:
        You have access to the user's current tasks list:
        ${JSON.stringify(currentTasks, null, 2)}
        
        YOUR PERSONALITY:
        - Deeply empathetic but structured.
        - You help the user align actions with their Ikigai.
        
        CAPABILITIES:
        1. Contextual Awareness: Use the tasks list to answer questions.
        2. Task Creation: Use 'createTask' tool for goals.
      `,
      tools: {
        createTask: tool({
          description: "Create a new task in the user's todo list.",
          inputSchema: z.object({
            title: z.string(),
            description: z.string().optional(),
            priority: z.number().optional(),
            eisenhowerQuadrant: z.enum([
              'Urgent & Important',
              'Not Urgent & Important',
              'Urgent & Not Important',
              'Not Urgent & Not Important'
            ]).optional(),
            effortEstimateMins: z.number().optional(),
          }),
          execute: async ({ title, description, priority, eisenhowerQuadrant, effortEstimateMins }) => {
            // Tool execution logic - this would call your createTask action
            return { success: true, message: `Task "${title}" created successfully` };
          },
        }),
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'chat-assistant',
        metadata: {
          userId: 'user', // You can add actual user ID here
          environment: process.env.NODE_ENV || 'development',
        },
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat AI Error:", error)
    return new Response(JSON.stringify({ error: "I'm having trouble thinking right now." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
