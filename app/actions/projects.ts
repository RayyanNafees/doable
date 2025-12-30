"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Project } from "@/lib/models/Project"
import { projectSchema, type ProjectFormData } from "@/lib/schemas/project"
import "@/lib/models/connect"
import { ActionResult, Project as ProjectType } from "@/lib/types"
import { getOrCreateDefaultUser } from "./users"
import { serialize } from "@/lib/utils"

export async function getProjects(): Promise<ActionResult<ProjectType[]>> {
  try {
    const projects = await Project.find({})
      .populate("userId", "email")
      .populate("assignedEmployees", "name")
      .lean()
    return { success: true, data: serialize(projects) as unknown as ProjectType[] }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function getProjectById(id: string): Promise<ActionResult<ProjectType>> {
  try {
    const project = await Project.findById(id)
      .populate("userId", "email")
      .populate("assignedEmployees", "name")
      .lean()
    if (!project) {
      return { success: false, error: "Project not found" }
    }
    return { success: true, data: serialize(project) as unknown as ProjectType }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error: "Failed to fetch project" }
  }
}

export async function createProject(data: ProjectFormData): Promise<ActionResult<ProjectType>> {
  try {
    const validated = projectSchema.parse(data)
    if (!validated.userId) {
      const defaultUser = await getOrCreateDefaultUser()
      validated.userId = defaultUser._id
    }
    const project = await Project.create(validated)
    revalidatePath("/dashboard/projects")
    return { success: true, data: serialize(project) as unknown as ProjectType }
  } catch (error: unknown) {
    console.error("Error creating project:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: (error instanceof Error ? error.message : "Failed to create project") }
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<ActionResult<ProjectType>> {
  try {
    const validated = projectSchema.partial().parse(data)
    const project = await Project.findByIdAndUpdate(id, validated, { new: true })
    if (!project) {
      return { success: false, error: "Project not found" }
    }
    revalidatePath("/dashboard/projects")
    return { success: true, data: serialize(project) as unknown as ProjectType }
  } catch (error: unknown) {
    console.error("Error updating project:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: (error instanceof Error ? error.message : "Failed to update project") }
  }
}

export async function deleteProject(id: string): Promise<ActionResult<void>> {
  try {
    const project = await Project.findByIdAndDelete(id)
    if (!project) {
      return { success: false, error: "Project not found" }
    }
    revalidatePath("/dashboard/projects")
    return { success: true, data: undefined as void }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}
