import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { getProjects } from "@/app/actions/projects"
import { ProjectDialog } from "./project-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { getEmployees } from "@/app/actions/employees"

import { Project, Employee } from "@/lib/types"

export default async function ProjectsManagePage() {
  const projectsResult = await getProjects()

  const employeesResult = await getEmployees()

  const projects = (projectsResult.success ? projectsResult.data : []) as Project[]

  const employees = (employeesResult.success ? employeesResult.data : []) as Employee[]

  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl w-full space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Project Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team projects and assignments.
            </p>
          </div>
          <ProjectDialog employeeIds={employees}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </ProjectDialog>
        </header>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <DataTable columns={columns} data={projects} searchKey="title" />
        </div>
      </div>
    </div>
  )
}
