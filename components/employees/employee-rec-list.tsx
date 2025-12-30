
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Brain } from "lucide-react"

import { Employee, GeneratedTask } from "@/lib/types"

interface EmployeeRecListProps {
  task: GeneratedTask
  employees: Employee[]
}

export function EmployeeRecList({ task, employees }: EmployeeRecListProps) {
  // Simple matching logic
  const matchedEmployees = employees.map(emp => {
    let score = emp.pastCompletionRate * 0.4
    const strengths = emp.psychology?.strengths || []
    const matches = strengths.filter((s: string) =>
      task.recommendedTraits.some((t: string) => t.toLowerCase().includes(s.toLowerCase()))
    )
    score += (matches.length / (task.recommendedTraits.length || 1)) * 0.6
    return { ...emp, score, matches }
  }).sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-4">
      {matchedEmployees.map((emp) => (
        <Card key={emp._id} className={emp.score > 0.7 ? "border-green-500/50" : ""}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {emp.name[0]}
              </div>
              <div>
                <CardTitle className="text-sm">{emp.name}</CardTitle>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-[9px] h-4">
                    Score: {Math.round(emp.score * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              Assign
            </Button>
          </CardHeader>
          <CardContent className="py-2 px-4 border-t bg-muted/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Brain className="h-3 w-3" />
                <span>Psychology Match:</span>
                <div className="flex gap-1">
                  {emp.matches.map((m: string) => (
                    <span key={m} className="text-primary font-medium">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Past Performance: {emp.pastCompletionRate * 100}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
