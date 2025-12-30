import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { Task, User } from "@/lib/types"

export async function generateMotivation(task: Task, user: User) {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `
        You are a motivational coach for a user with the following profile:
        Ikigai: ${user.ikigai}
        Life Goals: ${user.lifeGoals?.join(", ")}
        User Traits: ${user.psychology?.traits?.join(", ")}

        The user has a delayed task: "${task.title}".
        Reason for delay: ${task.why || "Unknown"}

        Generate a short, punchy, and highly motivational quote (1-2 sentences) that reminds the user WHY this task matters to their life goals and how completing it impacts their future.
      `,
    })

    return text
  } catch (error) {
    console.error("Motivation Error:", error)
    return "You've got this! Every small step counts towards your big goals."
  }
}
