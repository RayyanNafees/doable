"use client"

import { Task, User } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Quote, ArrowRight } from "lucide-react"

interface MotivationalNudgeProps {
  delayedTasks: Task[]
  user?: User
}

export function MotivationalNudge({ delayedTasks, user }: MotivationalNudgeProps) {
  if (delayedTasks.length === 0) return null

  // Pick the most "urgent" delayed task
  const targetTask = delayedTasks[0]

  const genericMotivations = [
    "Your future self is watching you right now. Make them proud.",
    "The cost of procrastination is the life you could have lived.",
    "Small progress is still progress. Break the inertia.",
    "Discipline is choosing between what you want now and what you want most.",
  ]

  const randomQuote = genericMotivations[Math.floor(Math.random() * genericMotivations.length)]

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Quote className="h-24 w-24 rotate-12" />
      </div>

      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                Impact Alert
              </Badge>
              <div className="flex items-center gap-1 text-xs font-bold text-white/80">
                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                <span>Delayed Task Detected</span>
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-tighter leading-none">
              {targetTask.title}
            </h2>

            <p className="text-lg text-white/90 font-medium italic">
              "{targetTask.why || randomQuote}"
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-tight">Future Impact: High</span>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-white text-indigo-700 rounded-full font-black uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all shadow-xl group">
                Execute Now
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-48 h-48 relative">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-white/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black leading-none">85%</div>
                <div className="text-[10px] font-black uppercase opacity-60">Alignment</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
