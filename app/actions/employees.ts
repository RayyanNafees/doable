"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Employee } from "@/lib/models/Employee"
import { employeeSchema, type EmployeeFormData } from "@/lib/schemas/employee"
import { ActionResult, Employee as EmployeeType } from "@/lib/types"
import { serialize } from "@/lib/utils"
import connectDB from "@/lib/models/connect"

export async function getEmployees(): Promise<ActionResult<EmployeeType[]>> {
  try {
    await connectDB()
    const employees = await Employee.find({}).lean()
    return { success: true, data: serialize(employees) as unknown as EmployeeType[] }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return { success: false, error: "Failed to fetch employees" }
  }
}

export async function getEmployeeById(id: string): Promise<ActionResult<EmployeeType>> {
  try {
    await connectDB()
    const employee = await Employee.findById(id).lean()
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    return { success: true, data: serialize(employee) as unknown as EmployeeType }
  } catch (error) {
    console.error("Error fetching employee:", error)
    return { success: false, error: "Failed to fetch employee" }
  }
}

export async function createEmployee(data: EmployeeFormData): Promise<ActionResult<EmployeeType>> {
  try {
    await connectDB()
    const validated = employeeSchema.parse(data)
    const employee = await Employee.create(validated)
    revalidatePath("/employees")
    return { success: true, data: serialize(employee) as unknown as EmployeeType }
  } catch (error: unknown) {
    console.error("Error creating employee:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: "Failed to create employee" }
  }
}

export async function updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<ActionResult<EmployeeType>> {
  try {
    await connectDB()
    const validated = employeeSchema.partial().parse(data)
    const employee = await Employee.findByIdAndUpdate(id, validated, { new: true })
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    revalidatePath("/employees")
    return { success: true, data: serialize(employee) as unknown as EmployeeType }
  } catch (error: unknown) {
    console.error("Error updating employee:", error)
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message
      return { success: false, error: firstError || "Validation error" }
    }
    return { success: false, error: "Failed to update employee" }
  }
}

export async function deleteEmployee(id: string): Promise<ActionResult<void>> {
  try {
    await connectDB()
    const employee = await Employee.findByIdAndDelete(id)
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    revalidatePath("/employees")
    return { success: true, data: undefined as void }
  } catch (error) {
    console.error("Error deleting employee:", error)
    return { success: false, error: "Failed to delete employee" }
  }
}
