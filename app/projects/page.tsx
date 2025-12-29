import { MainLayout } from "@/components/layout/main-layout"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { getProjects } from "@/app/actions/projects"
import { ProjectDialog } from "./project-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getUsers } from "@/app/actions/users"
import { getEmployees } from "@/app/actions/employees"

export default async function ProjectsPage() {
  const projectsResult = await getProjects()
  const usersResult = await getUsers()
  const employeesResult = await getEmployees()
  
  const projects = projectsResult.success ? projectsResult.data : []
  const users = usersResult.success ? usersResult.data : []
  const employees = employeesResult.success ? employeesResult.data : []

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Manage projects and team assignments
            </p>
          </div>
          <ProjectDialog userIds={users} employeeIds={employees}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </ProjectDialog>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <DataTable columns={columns} data={projects} searchKey="title" />
        </div>
      </div>
    </MainLayout>
  )
}

