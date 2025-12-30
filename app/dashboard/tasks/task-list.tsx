"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Edit, Trash2, TrendingUp, Split } from "lucide-react"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskDialog } from "./task-dialog"
import { deleteTask, updateTask, generateSubsteps } from "@/app/actions/tasks"

import { toast } from "sonner"
import { format, differenceInDays } from "date-fns"
import { ReversePomodoro } from "@/components/tasks/reverse-pomodoro"


interface TaskListProps {
  tasks: Task[]
  userIds: Array<{ _id: string; email: string }>
  projectIds: Array<{ _id: string; title: string }>
}

export function TaskList({ tasks, userIds, projectIds }: TaskListProps) {
  const router = useRouter()
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    const result = await updateTask(taskId, { isCompleted: !isCompleted })
    if (result.success) {
      router.refresh()
    } else {
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async (taskId: string) => {
    const result = await deleteTask(taskId)
    if (result.success) {
      toast.success("Task deleted")
      router.refresh()
    } else {
      toast.error("Failed to delete task")
    }
  }

  const incompleteTasks = tasks.filter((t) => !t.isCompleted)
  const completedTasks = tasks.filter((t) => t.isCompleted)

  return (
    <div className="space-y-6">
      {incompleteTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Active Tasks</h2>
          {incompleteTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              expanded={expandedTask === task._id}
              onExpand={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
              onToggleComplete={() => handleToggleComplete(task._id, task.isCompleted)}
              onDelete={() => handleDelete(task._id)}
              userIds={userIds}
              projectIds={projectIds}
            />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-muted-foreground">Completed</h2>
          {completedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              expanded={expandedTask === task._id}
              onExpand={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
              onToggleComplete={() => handleToggleComplete(task._id, task.isCompleted)}
              onDelete={() => handleDelete(task._id)}
              userIds={userIds}
              projectIds={projectIds}
            />
          ))}
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No tasks yet. Add some tasks to plan your day!</p>
        </div>
      )}
    </div>
  )
}

function TaskCard({
  task,
  expanded,
  onExpand,
  onToggleComplete,
  onDelete,
  userIds,
  projectIds,
}: {
  task: Task
  expanded: boolean
  onExpand: () => void
  onToggleComplete: () => void
  onDelete: () => void
  userIds: Array<{ _id: string; email: string }>
  projectIds: Array<{ _id: string; title: string }>
}) {
  const router = useRouter()

  const handleDeconstruct = async () => {
    toast.promise(generateSubsteps(task._id), {
      loading: 'AI is thinking...',
      success: 'Task decomposed into actionable steps',
      error: 'Failed to generate steps'
    })
    router.refresh()
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.isCompleted}
            onCheckedChange={onToggleComplete}
            className="mt-1"
          />
          <div className="flex-1 space-y-1" onClick={onExpand}>
            <CardTitle className="text-base font-medium cursor-pointer">
              {task.title}
            </CardTitle>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {task.priority && (
                <Badge variant={task.priority >= 4 ? "destructive" : "secondary"}>
                  P{task.priority}
                </Badge>
              )}
              {task.eisenhowerQuadrant && (
                <Badge variant="outline" className="text-xs">
                  {task.eisenhowerQuadrant}
                </Badge>
              )}
              {task.dueDate && (
                <Badge variant="outline" className="text-xs">
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </Badge>
              )}
              {task.effortEstimateMins && (
                <Badge variant="outline" className="text-xs">
                  {Math.floor(task.effortEstimateMins / 60)}h {task.effortEstimateMins % 60}m
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TaskDialog
                defaultValues={{
                  ...task,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  userId: typeof task.userId === 'object' ? (task.userId as any)._id : task.userId,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  projectId: typeof task.projectId === 'object' ? (task.projectId as any)?._id : task.projectId,
                  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                  lastDelayedAt: task.lastDelayedAt ? new Date(task.lastDelayedAt) : undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any}
                userIds={userIds}
                projectIds={projectIds}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </TaskDialog>
              <DropdownMenuItem onClick={handleDeconstruct}>
                <Split className="mr-2 h-4 w-4" />
                Deconstruct (AI)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {task.why && (
            <div className="pl-8 border-l-2 border-primary/20 bg-primary/5 p-3 rounded-r-lg">
              <p className="text-xs uppercase font-black text-primary/70 tracking-tighter mb-1">Impact Reason</p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {task.why}
              </p>
            </div>
          )}

          {task.substeps && task.substeps.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-4 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" /> Execution Path
              </p>
              <div className="grid gap-2 pl-4">
                {task.substeps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-all group">
                    <div className="relative flex items-center justify-center">
                      <Checkbox
                        checked={step.isCompleted}
                        onCheckedChange={async (val) => {
                          const newSubsteps = [...(task.substeps || [])]
                          newSubsteps[idx] = { ...step, isCompleted: !!val }
                          await updateTask(task._id, { substeps: newSubsteps })
                          router.refresh()
                        }}
                      />
                    </div>
                    <span className={`text-sm flex-1 ${step.isCompleted ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                      {step.title}
                    </span>
                    <Badge variant="outline" className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                      5m
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show Reverse Pomodoro if task is delayed by 1+ days */}
          {(task.lastDelayedAt && differenceInDays(new Date(), new Date(task.lastDelayedAt)) >= 1) || task.reversePomodoroActive ? (
            <div className="mt-4">
              <ReversePomodoro task={task} />
              <p className="mt-2 text-xs italic text-muted-foreground pl-4 border-l-2 border-orange-500">
                &quot;Small steps make big impacts. You&apos;re doing this for your future self.&quot;
              </p>
            </div>
          ) : null}
        </CardContent>
      )}
    </Card>
  )
}

