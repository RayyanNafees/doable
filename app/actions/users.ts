"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { User } from "@/lib/models/User"
import { userSchema, type UserFormData } from "@/lib/schemas/user"
import "@/lib/models/connect"
import { ActionResult, User as UserType } from "@/lib/types"
import { serialize } from "@/lib/utils"

export async function getUsers(): Promise<ActionResult<UserType[]>> {
  try {
    const users = await User.find({}).lean()
    return { success: true, data: serialize(users) as unknown as UserType[] }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUserById(id: string): Promise<ActionResult<UserType>> {
  try {
    const user = await User.findById(id).lean()
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, data: serialize(user) as unknown as UserType }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function createUser(data: UserFormData): Promise<ActionResult<UserType>> {
  try {
    const validated = userSchema.parse(data)
    const user = await User.create(validated)
    revalidatePath("/dashboard/users")
    return { success: true, data: serialize(user.toObject()) as unknown as UserType }
  } catch (error: unknown) {
    console.error("Error creating user:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, data: Partial<UserFormData>): Promise<ActionResult<UserType>> {
  try {
    const validated = userSchema.partial().parse(data)
    const user = await User.findByIdAndUpdate(id, validated, { new: true })
    if (!user) {
      return { success: false, error: "User not found" }
    }
    revalidatePath("/dashboard/users")
    return { success: true, data: serialize(user) as unknown as UserType }
  } catch (error: unknown) {
    console.error("Error updating user:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: "Failed to update user" }
  }
}

export async function getOrCreateDefaultUser(): Promise<UserType> {
  const users = await User.find({}).lean()
  if (users.length > 0) {
    return serialize(users[0]) as unknown as UserType
  }

  const newUser = await User.create({
    email: "user@doable.ai",
    persona: "Other",
  })
  return serialize(newUser.toObject()) as unknown as UserType
}

export async function deleteUser(id: string): Promise<ActionResult<void>> {
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    revalidatePath("/dashboard/users")
    return { success: true, data: undefined as void }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
