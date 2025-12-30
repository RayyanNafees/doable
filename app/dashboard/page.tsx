import { TaskQuickAdd } from "./tasks/task-quick-add"
import { TaskList } from "./tasks/task-list"
import { getTasks } from "@/app/actions/tasks"
import { getUsers } from "@/app/actions/users"
import { getProjects } from "@/app/actions/projects"
import { MotivationalNudge } from "@/components/dashboard/motivational-nudge"

export default async function Page() {
  const tasksResult = await getTasks()
  const usersResult = await getUsers()
  const projectsResult = await getProjects()

  const tasks = (tasksResult.success ? tasksResult.data : []) || []
  const users = (usersResult.success ? usersResult.data : []) || []
  const projects = (projectsResult.success ? projectsResult.data : []) || []

  const delayedTasks = tasks.filter(t => !t.isCompleted)

  return (
    <div className="p-4 overflow-auto">
      <div className="mx-auto max-w-4xl w-full space-y-8 py-4">
        <MotivationalNudge delayedTasks={delayedTasks} />

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Focus on Today</h1>
          <p className="text-sm text-muted-foreground">
            What&apos;s the most impactful thing you can do right now?
          </p>
        </div>
        <TaskQuickAdd userIds={users} projectIds={projects} />
        <TaskList tasks={tasks} userIds={users} projectIds={projects} />
      </div>
    </div>
  )
}
