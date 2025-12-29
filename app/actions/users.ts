"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/models/connect"
import { User } from "@/lib/models/User"
import { userSchema, type UserFormData } from "@/lib/schemas/user"

export async function getUsers() {
  try {
    await connectDB()
    const users = await User.find({}).lean()
    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUserById(id: string) {
  try {
    await connectDB()
    const user = await User.findById(id).lean()
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function createUser(data: UserFormData) {
  try {
    await connectDB()
    const validated = userSchema.parse(data)
    const user = await User.create(validated)
    revalidatePath("/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error creating user:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, data: Partial<UserFormData>) {
  try {
    await connectDB()
    const validated = userSchema.partial().parse(data)
    const user = await User.findByIdAndUpdate(id, validated, { new: true })
    if (!user) {
      return { success: false, error: "User not found" }
    }
    revalidatePath("/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    await connectDB()
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

