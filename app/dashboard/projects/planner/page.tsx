import { ProjectTaskGenerator } from "@/components/projects/project-task-generator"
import { getEmployees } from "@/app/actions/employees"

export default async function ProjectsPage() {
  const employeesResult = await getEmployees()
  const employees = employeesResult.success ? employeesResult.data : []

  return (
    <div className="p-4">
      <div className="mx-auto max-w-5xl w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold">AI Project Planner</h1>
          <p className="text-sm text-muted-foreground">
            Deconstruct project plans into tasks and get employee recommendations.
          </p>
        </div>
        <ProjectTaskGenerator initialEmployees={employees} />
      </div>
    </div>
  )
}
