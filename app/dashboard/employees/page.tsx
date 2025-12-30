import { DataTable } from "@/components/data-table"
import { getEmployees } from "@/app/actions/employees"
import { EmployeeDialog } from "./employee-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"

import { Employee } from "@/lib/types"

export default async function EmployeesPage() {
  const result = await getEmployees()
  const employees = (result.success ? result.data : []) as Employee[]

  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl w-full space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Employees</h1>
            <p className="text-sm text-muted-foreground">
              Manage employees and their psychological profiles for task matching.
            </p>
          </div>
          <EmployeeDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </EmployeeDialog>
        </header>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <DataTable columns={columns} data={employees} searchKey="name" />
        </div>
      </div>
    </div>
  )
}
