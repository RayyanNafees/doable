"use client"

import { useState } from "react"
import { Task } from "@/lib/models/Task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Play, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskDialog } from "./task-dialog"
import { deleteTask, updateTask } from "@/app/actions/tasks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface TaskListProps {
  tasks: any[]
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
  task: any
  expanded: boolean
  onExpand: () => void
  onToggleComplete: () => void
  onDelete: () => void
  userIds: Array<{ _id: string; email: string }>
  projectIds: Array<{ _id: string; title: string }>
}) {
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
              <TaskDialog defaultValues={task} userIds={userIds} projectIds={projectIds}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </TaskDialog>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {expanded && task.why && (
        <CardContent className="pt-0">
          <div className="pl-8 border-l-2 border-primary/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Why:</span> {task.why}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

