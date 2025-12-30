"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar as CalendarIcon, Hash } from "lucide-react"
import { getTasks } from "@/app/actions/tasks"
import { Task } from "@/lib/types"
import { isSameDay } from "date-fns"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasks()
      if (result.success) {
        setTasks(result.data || [])
      }
      setIsLoading(false)
    }
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task =>
    task.dueDate && date && isSameDay(new Date(task.dueDate), date)
  )

  return (
    <div className="p-4 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Temporal View</h1>
          <p className="text-sm text-muted-foreground">Mapping your commitments across time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-primary/70">Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md w-full"
                />
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary/70">Day Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-black">{filteredTasks.length}</p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Tasks</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black">
                      {filteredTasks.reduce((acc, curr) => acc + (curr.effortEstimateMins || 0), 0)}m
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Est. Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="py-20 text-center text-muted-foreground animate-pulse">Synchronizing calendar data...</div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card key={task._id} className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${task.priority >= 4 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                          }`}>
                          <Hash className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold">{task.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "All Day"}
                            </span>
                            {task.projectId && (
                              <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-tight">
                                {typeof task.projectId === 'object' ? task.projectId.title : 'Project'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={task.isCompleted ? "secondary" : "default"} className="px-3 py-1 font-black uppercase text-[10px]">
                        {task.isCompleted ? "COMPLETED" : "PENDING"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed border-muted text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <CalendarIcon className="h-12 w-12" />
                    <p className="text-sm font-bold uppercase tracking-widest">No Events Found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
