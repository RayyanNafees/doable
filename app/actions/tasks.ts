"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/models/connect"
import { Task } from "@/lib/models/Task"
import { taskSchema, type TaskFormData } from "@/lib/schemas/task"

export async function getTasks() {
  try {
    await connectDB()
    const tasks = await Task.find({})
      .populate("userId", "email")
      .populate("projectId", "title")
      .lean()
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function getTaskById(id: string) {
  try {
    await connectDB()
    const task = await Task.findById(id)
      .populate("userId", "email")
      .populate("projectId", "title")
      .lean()
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    return { success: true, data: task }
  } catch (error) {
    console.error("Error fetching task:", error)
    return { success: false, error: "Failed to fetch task" }
  }
}

export async function createTask(data: TaskFormData) {
  try {
    await connectDB()
    const validated = taskSchema.parse(data)
    const task = await Task.create(validated)
    revalidatePath("/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error creating task:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTask(id: string, data: Partial<TaskFormData>) {
  try {
    await connectDB()
    const validated = taskSchema.partial().parse(data)
    const task = await Task.findByIdAndUpdate(id, validated, { new: true })
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    revalidatePath("/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error updating task:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTask(id: string) {
  try {
    await connectDB()
    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

