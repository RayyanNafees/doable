"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/models/connect"
import { Integration } from "@/lib/models/Integration"
import { integrationSchema, type IntegrationFormData } from "@/lib/schemas/integration"

export async function getIntegrations() {
  try {
    await connectDB()
    const integrations = await Integration.find({})
      .populate("userId", "email")
      .lean()
    return { success: true, data: integrations }
  } catch (error) {
    console.error("Error fetching integrations:", error)
    return { success: false, error: "Failed to fetch integrations" }
  }
}

export async function getIntegrationById(id: string) {
  try {
    await connectDB()
    const integration = await Integration.findById(id)
      .populate("userId", "email")
      .lean()
    if (!integration) {
      return { success: false, error: "Integration not found" }
    }
    return { success: true, data: integration }
  } catch (error) {
    console.error("Error fetching integration:", error)
    return { success: false, error: "Failed to fetch integration" }
  }
}

export async function createIntegration(data: IntegrationFormData) {
  try {
    await connectDB()
    const validated = integrationSchema.parse(data)
    const integration = await Integration.create(validated)
    revalidatePath("/integrations")
    return { success: true, data: integration }
  } catch (error) {
    console.error("Error creating integration:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create integration" }
  }
}

export async function updateIntegration(id: string, data: Partial<IntegrationFormData>) {
  try {
    await connectDB()
    const validated = integrationSchema.partial().parse(data)
    const integration = await Integration.findByIdAndUpdate(id, validated, { new: true })
    if (!integration) {
      return { success: false, error: "Integration not found" }
    }
    revalidatePath("/integrations")
    return { success: true, data: integration }
  } catch (error) {
    console.error("Error updating integration:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update integration" }
  }
}

export async function deleteIntegration(id: string) {
  try {
    await connectDB()
    const integration = await Integration.findByIdAndDelete(id)
    if (!integration) {
      return { success: false, error: "Integration not found" }
    }
    revalidatePath("/integrations")
    return { success: true }
  } catch (error) {
    console.error("Error deleting integration:", error)
    return { success: false, error: "Failed to delete integration" }
  }
}

