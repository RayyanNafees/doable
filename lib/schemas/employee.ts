import { z } from "zod"

export const employeeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  psychology: z.object({
    strengths: z.array(z.string()).optional(),
    personalityType: z.string().optional(),
    motivationFactors: z.array(z.string()).optional(),
  }).optional(),
  pastCompletionRate: z.number().min(0).max(100).default(0),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

