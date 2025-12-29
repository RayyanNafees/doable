import { z } from "zod"

export const projectSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['Active', 'On Hold', 'Completed']).default('Active'),
  assignedEmployees: z.array(z.string()).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

