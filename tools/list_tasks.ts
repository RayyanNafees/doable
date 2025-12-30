import { z } from "zod";
import { Task } from "@/lib/models/Task";
import "@/lib/models/connect"; // Ensure DB connection

export default {
  name: "list_tasks",
  description: "Retrieve a list of tasks for a user, optionally filtered by completion status.",
  parameters: {
    userId: z.string().describe("The ID of the user to retrieve tasks for"),
    isCompleted: z.boolean().optional().describe("Filter by completion status (true/false)"),
    limit: z.number().default(10).describe("Maximum number of tasks to return"),
  },
  execute: async ({ userId, isCompleted, limit }: { userId: string; isCompleted?: boolean; limit: number }) => {
    try {
      const query: any = { userId };
      if (isCompleted !== undefined) {
        query.isCompleted = isCompleted;
      }

      const tasks = await Task.find(query).limit(limit).sort({ createdAt: -1 });

      return tasks.map((task: any) => ({
        id: task._id.toString(),
        title: task.title,
        isCompleted: task.isCompleted,
        priority: task.priority,
        dueDate: task.dueDate
      }));
    } catch (error: any) {
      return {
        error: error.message
      };
    }
  },
};
