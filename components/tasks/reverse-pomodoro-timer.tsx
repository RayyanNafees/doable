"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react"
import { toast } from "sonner"
import { Task } from "@/lib/types"

interface ReversePomodoroTimerProps {
  task: Task
  onComplete?: () => void
}

export function ReversePomodoroTimer({ task, onComplete }: ReversePomodoroTimerProps) {
  const WORK_TIME = 5 * 60 // 5 minutes
  const REST_TIME = 20 * 60 // 20 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"work" | "rest">("work")

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = useCallback(() => {
    setIsActive(false)
    setMode("work")
    setTimeLeft(WORK_TIME)
  }, [])

  const switchMode = useCallback(() => {
    if (mode === "work") {
      setMode("rest")
      setTimeLeft(REST_TIME)
      toast.success("Work session complete! Time to rest (20 mins).")
    } else {
      setMode("work")
      setTimeLeft(WORK_TIME)
      toast.info("Rest over! Back to work for 5 mins.")
    }
  }, [mode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      switchMode()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, switchMode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((mode === "work" ? WORK_TIME - timeLeft : REST_TIME - timeLeft) / (mode === "work" ? WORK_TIME : REST_TIME)) * 100

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${mode === "work" ? "bg-primary/20" : "bg-orange-500/20"}`}>
            {mode === "work" ? (
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            ) : (
              <Coffee className="h-8 w-8 text-orange-500 animate-bounce" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold uppercase tracking-tight">
          {mode === "work" ? "Flash Work" : "Recovery Phase"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "work" ? "Focus intensely for 5 minutes" : "Deep rest for 20 minutes"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="text-center">
          <span className="text-7xl font-black font-mono tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </span>
        </div>

        <Progress value={progress} className={`h-2 ${mode === "work" ? "bg-primary/10" : "bg-orange-500/10"}`} />

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={isActive ? "outline" : "default"}
            className="w-32 h-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-105"
            onClick={toggleTimer}
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
            onClick={resetTimer}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Target Task</p>
          <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
            <span className="text-sm font-semibold truncate flex-1 pr-4">{task.title}</span>
            {task.priority && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${task.priority <= 2 ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"
                }`}>
                P{task.priority}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
