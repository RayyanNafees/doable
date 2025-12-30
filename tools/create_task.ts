import { z } from "zod";
import { Task } from "@/lib/models/Task";
import "@/lib/models/connect"; // Ensure DB connection

export default {
  name: "create_task",
  description: "Create a new task in the user's to-do list.",
  parameters: {
    title: z.string().describe("The title of the task"),
    description: z.string().optional().describe("A more detailed description of the task"),
    priority: z.number().min(1).max(5).default(3).describe("Priority level (1-5), where 5 is highest"),
    userId: z.string().describe("The ID of the user creating the task"),
    dueDate: z.string().optional().describe("Due date in ISO 8601 format"),
  },
  execute: async ({ title, description, priority, userId, dueDate }: { title: string; description?: string; priority: number; userId: string; dueDate?: string }) => {
    try {
      const task = await Task.create({
        title,
        description,
        priority,
        userId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      return {
        success: true,
        task: {
          id: task._id.toString(),
          title: task.title,
          status: "created"
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },
};
