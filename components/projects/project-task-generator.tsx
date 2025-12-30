"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { EmployeeRecList } from "@/components/employees/employee-rec-list"

import { Employee, GeneratedTask } from "@/lib/types"

interface ProjectTaskGeneratorProps {
  initialEmployees: Employee[]
}

export function ProjectTaskGenerator({ initialEmployees }: ProjectTaskGeneratorProps) {
  const [plan, setPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [matchingTaskId, setMatchingTaskId] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!plan.trim()) return toast.error("Please enter a project plan")

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/process-project", {
        method: "POST",
        body: JSON.stringify({ projectPlan: plan, employees: initialEmployees })
      })
      const data = await response.json()
      setGeneratedTasks(data.tasks)
      toast.success("Tasks generated successfully!")
    } catch {
      toast.error("Failed to generate tasks")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Project Planner
          </CardTitle>
          <CardDescription>
            Paste your project plan or requirements below. Gemini will break it down into actionable tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g. We need to build a new landing page with three sections: Hero, Features, and Pricing. It should be responsive and use a dark theme..."
            rows={8}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Plan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {generatedTasks.length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Recommended Tasks</h3>
          {generatedTasks.map((task, i) => (
            <Card key={i}>
              <CardHeader className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <CardDescription className="text-xs">{task.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{task.effortEstimateMins} mins</Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex flex-wrap gap-2">
                  {task.recommendedTraits.map((trait: string) => (
                    <Badge key={trait} variant="outline" className="text-[10px]">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="py-2 border-t flex flex-col items-stretch gap-4">
                <div className="flex justify-end w-full">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-[10px]"
                    onClick={() => setMatchingTaskId(matchingTaskId === i ? null : i)}
                  >
                    <UserPlus className="mr-2 h-3 w-3" />
                    {matchingTaskId === i ? "Hide Recommendations" : "Find Best Employee"}
                  </Button>
                </div>
                {matchingTaskId === i && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Top Matches</h4>
                    <EmployeeRecList task={task} employees={initialEmployees} />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
