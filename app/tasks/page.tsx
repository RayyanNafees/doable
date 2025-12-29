import { MainLayout } from "@/components/layout/main-layout"
import { TaskQuickAdd } from "./task-quick-add"
import { TaskList } from "./task-list"
import { getTasks } from "@/app/actions/tasks"
import { getUsers } from "@/app/actions/users"
import { getProjects } from "@/app/actions/projects"

export default async function TasksPage() {
  const tasksResult = await getTasks()
  const usersResult = await getUsers()
  const projectsResult = await getProjects()
  
  const tasks = tasksResult.success ? tasksResult.data : []
  const users = usersResult.success ? usersResult.data : []
  const projects = projectsResult.success ? projectsResult.data : []

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tasks with psychological context
            </p>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <TaskQuickAdd userIds={users} projectIds={projects} />
            <TaskList tasks={tasks} userIds={users} projectIds={projects} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
