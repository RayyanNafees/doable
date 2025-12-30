import { EisenhowerMatrix } from "@/components/tasks/eisenhower-matrix"
import { getTasks } from "@/app/actions/tasks"

export default async function MatrixPage() {
  const tasksResult = await getTasks()
  const tasks = tasksResult.success ? tasksResult.data : []

  return (
    <div className="p-4 h-[calc(100vh-5rem)]">
      <div className="flex flex-col h-full space-y-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Priority Matrix</h1>
          <p className="text-sm text-muted-foreground">
            Tasks automatically sorted based on your psychological profile and urgency.
          </p>
        </div>
        <div className="flex-1">
          <EisenhowerMatrix tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
