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
    <div className="p-4">
      <div className="mx-auto max-w-4xl w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal and work tasks with AI assistance.
          </p>
        </div>
        <TaskQuickAdd userIds={users} projectIds={projects} />
        <TaskList tasks={tasks} userIds={users} projectIds={projects} />
      </div>
    </div>
  )
}
