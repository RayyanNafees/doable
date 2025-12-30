"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Task } from "@/lib/models/Task"
import { taskSchema, type TaskFormData } from "@/lib/schemas/task"
import { ActionResult, Task as TaskType } from "@/lib/types"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { User } from "@/lib/models/User"
import { getOrCreateDefaultUser } from "./users"

const enrichmentSchema = z.object({
  eisenhowerQuadrant: z.enum([
    'Urgent & Important',
    'Not Urgent & Important',
    'Urgent & Not Important',
    'Not Urgent & Not Important'
  ]),
  effortEstimateMins: z.number(),
  why: z.string().describe("A short, motivating reason why this task matters to the user's specific Ikigai and goals."),
})


export async function getTasks(): Promise<ActionResult<TaskType[]>> {
  try {
    const tasks = await Task.find({})
      .populate("userId", "email")
      .populate("projectId", "title")
      .lean()
    return { success: true, data: tasks as unknown as TaskType[] }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function getTaskById(id: string): Promise<ActionResult<TaskType>> {
  try {
    const task = await Task.findById(id)
      .populate("userId", "email")
      .populate("projectId", "title")
      .lean()
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    return { success: true, data: task as unknown as TaskType }
  } catch (error) {
    console.error("Error fetching task:", error)
    return { success: false, error: "Failed to fetch task" }
  }
}

export async function createTask(data: TaskFormData): Promise<ActionResult<TaskType>> {
  try {
    const validated = taskSchema.parse(data)
    let finalData = { ...validated }

    if (!finalData.userId) {
      const defaultUser = await getOrCreateDefaultUser()
      finalData.userId = defaultUser._id
    }

    // AI Enrichment: Automatically sort and find the "Why"
    try {
      if (!finalData.eisenhowerQuadrant || !finalData.effortEstimateMins || !finalData.why) {
        const user = await User.findById(finalData.userId).lean()
        if (user) {
          const { object } = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: enrichmentSchema,
            prompt: `
            Analyze this task: "${finalData.title}"
            Description: "${finalData.description || ''}"
            
            User Context:
            - Ikigai: ${user.ikigai || 'Unknown'}
            - Life Goals: ${(user.lifeGoals || []).join(', ')}
            - Traits: ${(user.psychology?.traits || []).join(', ')}
            
            1. Assign an Eisenhower Matrix quadrant based on urgency and importance to THIS specific user's goals.
            2. Estimate effort in minutes (default to 15 if unsure).
            3. Write a 1-sentence "Why" explaining the impact of this task on their life goals.
            `,
          })

          finalData = {
            ...finalData,
            eisenhowerQuadrant: finalData.eisenhowerQuadrant || object.eisenhowerQuadrant,
            effortEstimateMins: finalData.effortEstimateMins || object.effortEstimateMins,
            why: finalData.why || object.why,
          }
        }
      }
    } catch (aiError) {
      console.error("AI Enrichment failed, falling back to defaults:", aiError)
    }

    const task = await Task.create(finalData)
    revalidatePath("/dashboard")
    return { success: true, data: task as unknown as TaskType }
  } catch (error: any) {
    console.error("Error creating task:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: error.message || "Failed to create task" }
  }
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<ActionResult<TaskType>> {
  try {
    const validated = taskSchema.partial().parse(data)
    const task = await Task.findByIdAndUpdate(id, validated, { new: true })
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    revalidatePath("/dashboard")
    return { success: true, data: task as unknown as TaskType }
  } catch (error: any) {
    console.error("Error updating task:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: error.message || "Failed to update task" }
  }
}

export async function deleteTask(id: string): Promise<ActionResult<void>> {
  try {
    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    revalidatePath("/dashboard")
    return { success: true, data: undefined as void }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function generateSubsteps(taskId: string): Promise<ActionResult<void>> {
  try {
    const task = await Task.findById(taskId)
    if (!task) return { success: false, error: "Task not found" }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        substeps: z.array(z.object({
          title: z.string(),
          durationMins: z.number().default(5),
        }))
      }),
      prompt: `
        Break down this task into small, actionable 5-minute substeps:
        Task: "${task.title}"
        Description: "${task.description || ''}"
        
        Rules:
        1. Each step should be completable in roughly 5 minutes.
        2. Make them concrete and actionable (e.g., "Open file", "Write function signature", "Add error handling").
        3. Generate 3-10 steps depending on complexity.
      `,
    })

    task.substeps = object.substeps.map(s => ({ ...s, isCompleted: false }))
    await task.save()

    revalidatePath("/dashboard")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error generating substeps:", error)
    return { success: false, error: "Failed to generate substeps" }
  }
}
