import { z } from "zod"

export const substepSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  durationMins: z.number().default(5),
  isCompleted: z.boolean().default(false),
})

export const taskSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  projectId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  why: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
  eisenhowerQuadrant: z.enum([
    'Urgent & Important',
    'Not Urgent & Important',
    'Urgent & Not Important',
    'Not Urgent & Not Important'
  ]).optional(),
  dueDate: z.date().optional().nullable(),
  effortEstimateMins: z.number().optional(),
  isCompleted: z.boolean().default(false),
  substeps: z.array(substepSchema).optional(),
  lastDelayedAt: z.date().optional().nullable(),
  reversePomodoroActive: z.boolean().default(false),
})

export type TaskFormData = z.infer<typeof taskSchema>
export type SubstepFormData = z.infer<typeof substepSchema>

