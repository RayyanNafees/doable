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
import { IntegrationForm } from "@/components/forms/integration-form"
import { createIntegration, updateIntegration } from "@/app/actions/integrations"
import { IntegrationFormData } from "@/lib/schemas/integration"
import { toast } from "sonner"

interface IntegrationDialogProps {
  children: React.ReactNode
  defaultValues?: Partial<IntegrationFormData>
  userIds?: Array<{ _id: string; email: string }>
}

export function IntegrationDialog({ children, defaultValues, userIds = [] }: IntegrationDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isEdit = !!defaultValues?._id

  const handleSubmit = async (data: IntegrationFormData) => {
    try {
      if (isEdit && defaultValues?._id) {
        const result = await updateIntegration(defaultValues._id, data)
        if (result.success) {
          toast.success("Integration updated successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update integration")
        }
      } else {
        const result = await createIntegration(data)
        if (result.success) {
          toast.success("Integration created successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create integration")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Integration" : "Create Integration"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update integration settings and credentials."
              : "Add a new external platform integration."}
          </DialogDescription>
        </DialogHeader>
        <IntegrationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          userIds={userIds}
        />
      </DialogContent>
    </Dialog>
  )
}

