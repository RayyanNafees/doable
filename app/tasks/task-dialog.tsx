"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TaskForm } from "@/components/forms/task-form"
import { createTask, updateTask } from "@/app/actions/tasks"
import { TaskFormData } from "@/lib/schemas/task"
import { toast } from "sonner"

interface TaskDialogProps {
  children: React.ReactNode
  defaultValues?: Partial<TaskFormData>
  userIds?: Array<{ _id: string; email: string }>
  projectIds?: Array<{ _id: string; title: string }>
}

export function TaskDialog({ children, defaultValues, userIds = [], projectIds = [] }: TaskDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isEdit = !!defaultValues?._id

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (isEdit && defaultValues?._id) {
        const result = await updateTask(defaultValues._id, data)
        if (result.success) {
          toast.success("Task updated successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update task")
        }
      } else {
        const result = await createTask(data)
        if (result.success) {
          toast.success("Task created successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create task")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update task information and psychological context."
              : "Add a new task with psychological context."}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          userIds={userIds}
          projectIds={projectIds}
        />
      </DialogContent>
    </Dialog>
  )
}

