"use server"

import { revalidatePath } from "next/cache"
import { User } from "@/lib/models/User"
import { z } from "zod"

const quizResultSchema = z.object({
  userId: z.string(),
  ikigai: z.string(),
  lifeGoals: z.array(z.string()),
  quizResults: z.record(z.any()),
})

export async function submitPsychologyQuiz(data: z.infer<typeof quizResultSchema>) {
  try {


    // In a real app, we'd process the quiz results to derive traits
    // For now, we'll suggest some common traits based on Ikigai
    const traits = ["Purpose-driven", "Impact-focused"]
    if (data.ikigai.toLowerCase().includes("help")) traits.push("Altruistic")
    if (data.ikigai.toLowerCase().includes("create")) traits.push("Creative")

    const user = await User.findByIdAndUpdate(
      data.userId,
      {
        ikigai: data.ikigai,
        lifeGoals: data.lifeGoals,
        "psychology.quizResults": data.quizResults,
        "psychology.traits": traits,
        "psychology.lastPsychUpdate": new Date(),
      },
      { new: true }
    )

    if (!user) {
      return { success: false, error: "User not found" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/profile")

    return { success: true, data: user }
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return { success: false, error: "Failed to save psychological data" }
  }
}
