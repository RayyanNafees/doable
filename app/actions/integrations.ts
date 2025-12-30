"use server"

import { revalidatePath } from "next/cache"
import { ActionResult } from "@/lib/types"
import { Integration } from "@/lib/models/Integration"

export async function saveIntegration(data: Record<string, string>): Promise<ActionResult<string>> {
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

export async function createIntegration(data: Record<string, string>): Promise<ActionResult<string>> {
  return saveIntegration(data)
}

export async function updateIntegration(id: string, data: Record<string, string>): Promise<ActionResult<string>> {
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
