import { MainLayout } from "@/components/layout/main-layout"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { getEmployees } from "@/app/actions/employees"
import { EmployeeDialog } from "./employee-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function EmployeesPage() {
  const result = await getEmployees()
  const employees = result.success ? result.data : []

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-semibold">Employees</h1>
            <p className="text-sm text-muted-foreground">
              Manage employees and their psychological profiles for matching
            </p>
          </div>
          <EmployeeDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </EmployeeDialog>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <DataTable columns={columns} data={employees} searchKey="name" />
        </div>
      </div>
    </MainLayout>
  )
}

