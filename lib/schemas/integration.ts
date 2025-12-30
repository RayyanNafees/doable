import { z } from "zod"

export const integrationSchema = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  platform: z.enum(['Email', 'ClickUp', 'Todoist']),
  credentials: z.record(z.string(), z.string()).optional(),
  lastSyncedAt: z.date().optional().nullable(),
})

export type IntegrationFormData = z.infer<typeof integrationSchema>

