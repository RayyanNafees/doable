"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createTask } from "@/app/actions/tasks"
import { toast } from "sonner"
import { Check } from "lucide-react"
import { parseTaskInput } from "@/lib/task-parser"

interface TaskQuickAddProps {
  userIds: Array<{ _id: string; email: string }>
  projectIds: Array<{ _id: string; title: string }>
}

export function TaskQuickAdd({ userIds, projectIds }: TaskQuickAddProps) {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Parse natural language input
      const parsed = parseTaskInput(input, userIds, projectIds)
      
      const result = await createTask(parsed)
      if (result.success) {
        toast.success("Task created successfully")
        setInput("")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create task")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder='Add task to top of list. Example: "Some task title @fri 4pm +projectName #some-tag #some-other-tag 10m/3h"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] resize-none text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e)
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Use natural language: @date, +project, #tags, time estimates. Press Cmd/Ctrl+Enter to submit.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              disabled={!input.trim() || isSubmitting}
              className="min-w-[200px]"
            >
              <Check className="mr-2 h-4 w-4" />
              {isSubmitting ? "Adding..." : "Ready to work!"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

