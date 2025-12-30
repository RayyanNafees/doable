"use client"

import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EisenhowerMatrixProps {
  tasks: Task[]
}

const quadrants = [
  { id: "Urgent & Important", title: "Do First", color: "bg-red-500/10 border-red-500/20" },
  { id: "Not Urgent & Important", title: "Schedule", color: "bg-blue-500/10 border-blue-500/20" },
  { id: "Urgent & Not Important", title: "Delegate", color: "bg-yellow-500/10 border-yellow-500/20" },
  { id: "Not Urgent & Not Important", title: "Eliminate", color: "bg-slate-500/10 border-slate-500/20" },
]

export function EisenhowerMatrix({ tasks }: EisenhowerMatrixProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {quadrants.map((q) => {
        const quadrantTasks = tasks.filter(t => t.eisenhowerQuadrant === q.id)
        return (
          <Card key={q.id} className={cn("flex flex-col", q.color)}>
            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                {q.title}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {q.id}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[300px]">
              {quadrantTasks.length > 0 ? (
                quadrantTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-2 bg-background border rounded-md text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <p className="font-medium line-clamp-1">{task.title}</p>
                    {task.effortEstimateMins && (
                      <p className="text-[10px] text-muted-foreground">
                        {task.effortEstimateMins} mins
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-[10px] italic">
                  No tasks here
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
