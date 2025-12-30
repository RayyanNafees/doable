"use client"

import { useState, useEffect } from "react"
import { getTasks } from "@/app/actions/tasks"
import { Task } from "@/lib/types"
import { ReversePomodoroTimer } from "@/components/tasks/reverse-pomodoro-timer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, AlertCircle } from "lucide-react"

export default function PomodoroPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasks()
      if (result.success) {
        // Filter for "potentially delayed" tasks (not completed and past due or just general backlog)
        const delayedTasks = result.data?.filter(t => !t.isCompleted) || []
        setTasks(delayedTasks)
      }
      setIsLoading(false)
    }
    fetchTasks()
  }, [])

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Initializing protocols...</div>
  }

  return (
    <div className="p-4 overflow-auto min-h-full bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Reverse Pomodoro</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Engineered for high-friction tasks. 5 minutes of focused impact, followed by 20 minutes of neural recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="border-2 border-primary/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Stalled Tasks
                </CardTitle>
                <CardDescription>Select a task that has been resisting your focus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <button
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${selectedTask?._id === task._id
                          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                          : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`font-bold text-sm truncate ${selectedTask?._id === task._id ? "text-white" : "text-foreground"}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className={`h-3 w-3 ${selectedTask?._id === task._id ? "text-white/70" : "text-muted-foreground"}`} />
                          <span className={`text-[10px] font-mono ${selectedTask?._id === task._id ? "text-white/70" : "text-muted-foreground"}`}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Deadline"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${selectedTask?._id === task._id ? "translate-x-1" : "group-hover:translate-x-1 text-muted-foreground"}`} />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground opacity-50">
                    No active tasks found in the backlog.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="sticky top-24">
            {selectedTask ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <ReversePomodoroTimer task={selectedTask} />
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl p-12 text-center opacity-40">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Clock className="h-12 w-12" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">System Ready</h3>
                <p className="max-w-xs text-xs mt-2">Select a stalled core task to initiate the Reverse Pomodoro protocol.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
