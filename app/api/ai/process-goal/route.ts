import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

export const runtime = "edge"

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  effortEstimateMins: z.number(),
  priority: z.number().min(1).max(5),
  substeps: z.array(z.object({
    title: z.string(),
    durationMins: z.number().default(5)
  }))
})

export async function POST(req: Request) {
  try {
    const { prompt, userContext } = await req.json()

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: taskSchema,
      prompt: `
        You are an AI Productivity Agent.
        The user said: "${prompt}"
        User Context (Psychology/Ikigai): ${JSON.stringify(userContext)}
        
        Convert this into a structured task. 
        If it's a big task, break it down into multiple 5-minute sub-steps.
        Assign a priority (1-5) and an effort estimate in minutes.
        If the user mentions a specific time like "after lunch", include that in the description.
      `,
    })

    return Response.json(object)
  } catch (error) {
    console.error("AI Error:", error)
    return Response.json({ error: "Failed to process goal" }, { status: 500 })
  }
}
