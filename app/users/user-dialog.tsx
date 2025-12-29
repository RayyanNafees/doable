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
import { UserForm } from "@/components/forms/user-form"
import { createUser, updateUser } from "@/app/actions/users"
import { UserFormData } from "@/lib/schemas/user"
import { toast } from "sonner"

interface UserDialogProps {
  children: React.ReactNode
  defaultValues?: Partial<UserFormData>
}

export function UserDialog({ children, defaultValues }: UserDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isEdit = !!defaultValues?._id

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (isEdit && defaultValues?._id) {
        const result = await updateUser(defaultValues._id, data)
        if (result.success) {
          toast.success("User updated successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update user")
        }
      } else {
        const result = await createUser(data)
        if (result.success) {
          toast.success("User created successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create user")
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
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user information and psychological profile."
              : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

