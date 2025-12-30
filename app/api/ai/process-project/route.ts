import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

export const runtime = "edge"

const projectTaskSchema = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    requirements: z.string(),
    recommendedTraits: z.array(z.string()),
    effortEstimateMins: z.number()
  }))
})

export async function POST(req: Request) {
  try {
    const { projectPlan, employees } = await req.json()

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: projectTaskSchema,
      prompt: `
        Analyze this project plan: "${projectPlan}"
        
        Generate a list of tasks. For each task, specify:
        1. Title and Description
        2. Technical/Personal requirements
        3. Recommended psychological traits for the employee (e.g., "Deep focus", "Creative", "Detail-oriented")
        4. Effort estimate in minutes.

        Available Employees (Psychology): ${JSON.stringify(employees)}
      `,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Project AI Error:", error)
    return Response.json({ error: "Failed to process project plan" }, { status: 500 })
  }
}
