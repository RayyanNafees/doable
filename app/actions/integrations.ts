"use server"

import { revalidatePath } from "next/cache"
import { ActionResult, Integration as IntegrationType } from "@/lib/types"
import { Integration } from "@/lib/models/Integration"
import { IntegrationFormData } from "@/lib/schemas/integration"

export async function saveIntegration(data: IntegrationFormData): Promise<ActionResult<string>> {
  try {

    const { _id, ...rest } = data

    if (_id) {
      await Integration.findByIdAndUpdate(_id, rest)
    } else {
      await Integration.create(rest)
    }

    revalidatePath("/dashboard/integrations")
    return { success: true, data: "Integration saved successfully" }
  } catch (error) {
    console.error("Save Integration Error:", error)
    return { success: false, error: "Failed to save integration" }
  }
}

export async function deleteIntegration(id: string): Promise<ActionResult<void>> {
  try {

    await Integration.findByIdAndDelete(id)
    revalidatePath("/dashboard/integrations")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("Delete Integration Error:", error)
    return { success: false, error: "Failed to delete integration" }
  }
}

export async function createIntegration(data: IntegrationFormData): Promise<ActionResult<string>> {
  return saveIntegration(data)
}

export async function updateIntegration(id: string, data: IntegrationFormData): Promise<ActionResult<string>> {
  return saveIntegration({ ...data, _id: id })
}

export async function toggleIntegration(platform: string, currentStatus: string): Promise<ActionResult<string>> {
  try {

    // Simulate updating integration status in DB
    const newStatus = currentStatus === "Connected" ? "Disconnected" : "Connected"

    // In a real app: await Integration.findOneAndUpdate({ platform }, { status: newStatus })

    revalidatePath("/dashboard/integrations")
    return { success: true, data: newStatus }
  } catch (error) {
    console.error("Integration Error:", error)
    return { success: false, error: "Failed to toggle integration" }
  }
}


export async function syncIntegration(platform: string): Promise<ActionResult<void>> {
  try {

    // Simulate sync logic
    await new Promise(resolve => setTimeout(resolve, 1500))

    revalidatePath("/dashboard/integrations")
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: "Sync failed" }
  }
}

export async function getIntegrations(): Promise<ActionResult<IntegrationType[]>> {
  try {
    const integrations = await Integration.find({}).populate('userId').sort({ createdAt: -1 }).lean()
    return { success: true, data: integrations as unknown as IntegrationType[] }
  } catch (error) {
    console.error("Get Integrations Error:", error)
    return { success: false, error: "Failed to fetch integrations" }
  }
}
