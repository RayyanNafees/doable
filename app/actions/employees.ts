"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/models/connect"
import { Employee } from "@/lib/models/Employee"
import { employeeSchema, type EmployeeFormData } from "@/lib/schemas/employee"

export async function getEmployees() {
  try {
    await connectDB()
    const employees = await Employee.find({}).lean()
    return { success: true, data: employees }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return { success: false, error: "Failed to fetch employees" }
  }
}

export async function getEmployeeById(id: string) {
  try {
    await connectDB()
    const employee = await Employee.findById(id).lean()
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error fetching employee:", error)
    return { success: false, error: "Failed to fetch employee" }
  }
}

export async function createEmployee(data: EmployeeFormData) {
  try {
    await connectDB()
    const validated = employeeSchema.parse(data)
    const employee = await Employee.create(validated)
    revalidatePath("/employees")
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error creating employee:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create employee" }
  }
}

export async function updateEmployee(id: string, data: Partial<EmployeeFormData>) {
  try {
    await connectDB()
    const validated = employeeSchema.partial().parse(data)
    const employee = await Employee.findByIdAndUpdate(id, validated, { new: true })
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    revalidatePath("/employees")
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error updating employee:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update employee" }
  }
}

export async function deleteEmployee(id: string) {
  try {
    await connectDB()
    const employee = await Employee.findByIdAndDelete(id)
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    revalidatePath("/employees")
    return { success: true }
  } catch (error) {
    console.error("Error deleting employee:", error)
    return { success: false, error: "Failed to delete employee" }
  }
}

