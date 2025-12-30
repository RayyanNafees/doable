import { z } from "zod"

export const userSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  persona: z.enum(['Software Developer', 'Product Manager', 'Team Leader', 'Other']).default('Other'),
  ikigai: z.string().optional(),
  psychology: z.object({
    quizResults: z.record(z.string(), z.any()).optional(),
    traits: z.array(z.string()).optional(),
    lastPsychUpdate: z.date().optional(),
  }).optional(),
  lifeGoals: z.array(z.string()).optional(),
})

export type UserFormData = z.infer<typeof userSchema>

