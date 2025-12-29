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
import { EmployeeForm } from "@/components/forms/employee-form"
import { createEmployee, updateEmployee } from "@/app/actions/employees"
import { EmployeeFormData } from "@/lib/schemas/employee"
import { toast } from "sonner"

interface EmployeeDialogProps {
  children: React.ReactNode
  defaultValues?: Partial<EmployeeFormData>
}

export function EmployeeDialog({ children, defaultValues }: EmployeeDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isEdit = !!defaultValues?._id

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEdit && defaultValues?._id) {
        const result = await updateEmployee(defaultValues._id, data)
        if (result.success) {
          toast.success("Employee updated successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update employee")
        }
      } else {
        const result = await createEmployee(data)
        if (result.success) {
          toast.success("Employee created successfully")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create employee")
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
          <DialogTitle>{isEdit ? "Edit Employee" : "Create Employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update employee information and psychological profile."
              : "Add a new employee to the system."}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

