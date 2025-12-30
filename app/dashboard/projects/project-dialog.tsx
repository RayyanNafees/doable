"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProjectForm } from "@/components/forms/project-form"
import { createProject, updateProject } from "@/app/actions/projects"
import { ProjectFormData } from "@/lib/schemas/project"
import { toast } from "sonner"

interface ProjectDialogProps {
  children: React.ReactNode
  defaultValues?: Partial<ProjectFormData>
  userIds?: Array<{ _id: string; email: string }>
  employeeIds?: Array<{ _id: string; name: string }>
}

export function ProjectDialog({ children, defaultValues, userIds = [], employeeIds = [] }: ProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const isEdit = !!defaultValues?._id

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      if (isEdit && defaultValues?._id) {
        const result = await updateProject(defaultValues._id, data)
        if (result.success) {
          toast.success("Project updated successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update project")
        }
      } else {
        const result = await createProject(data)
        if (result.success) {
          toast.success("Project created successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create project")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "Create Project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update project information and assignments."
              : "Add a new project to the system."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          userIds={userIds}
          employeeIds={employeeIds}
        />
      </DialogContent>
    </Dialog>
  )
}
