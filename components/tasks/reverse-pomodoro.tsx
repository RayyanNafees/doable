"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react"
import { toast } from "sonner"

interface ReversePomodoroProps {
  task: {
    _id: string
    title: string
  }
}

export function ReversePomodoro({ task }: ReversePomodoroProps) {
  const WORK_TIME = 5 * 60 // 5 minutes
  const REST_TIME = 20 * 60 // 20 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isActive, setIsActive] = useState(false)
  const [isResting, setIsResting] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (!isResting) {
        toast.success("Work session complete! Time to rest (20 mins).")
        setIsResting(true)
        setTimeLeft(REST_TIME)
      } else {
        toast.info("Rest session complete! Ready for 5 mins of work?")
        setIsResting(false)
        setTimeLeft(WORK_TIME)
      }
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isResting])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setIsResting(false)
    setTimeLeft(WORK_TIME)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full bg-accent/20 border-primary/20">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Reverse Pomodoro: {task.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isResting ? (
              <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                <Coffee className="h-3 w-3" /> Resting
              </span>
            ) : (
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <Play className="h-3 w-3" /> Working
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4">
        <div className="text-4xl font-mono font-bold">
          {formatTime(timeLeft)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 py-3">
        <Button size="sm" variant="outline" onClick={toggleTimer}>
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
