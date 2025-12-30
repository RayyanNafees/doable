"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { createTask } from "@/app/actions/tasks"
import { toast } from "sonner"
import { Check } from "lucide-react"
import { parseTaskInput } from "@/lib/task-parser"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit
} from "@/components/ai-elements/prompt-input"

interface TaskQuickAddProps {
  userIds: Array<{ _id: string; email: string }>
  projectIds: Array<{ _id: string; title: string }>
}

export function TaskQuickAdd({ userIds, projectIds }: TaskQuickAddProps) {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleQuickAdd = async (message: { text: string }) => {
    if (!message.text.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Parse natural language input
      const parsed = parseTaskInput(message.text, userIds, projectIds)

      const result = await createTask({
        ...parsed,
        priority: 3, // Default priority
        isCompleted: false,
        reversePomodoroActive: false,
      })
      if (result.success) {
        toast.success("Task created successfully")
        setInput("")
        router.refresh()
        return Promise.resolve() // This tells PromptInput to clear
      } else {
        toast.error(result.error || "Failed to create task")
        return Promise.reject()
      }
    } catch {
      toast.error("An unexpected error occurred")
      return Promise.reject()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <PromptInput
          onSubmit={handleQuickAdd}
          className="bg-transparent"
        >
          <PromptInputTextarea
            placeholder={userIds.length === 0 ? "No (persona) users found. Please create a user first." : 'Quick add: "Write docs @tomorrow +Dashboard #docs 2h"'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] border-none bg-transparent focus-visible:ring-0 px-6 py-6 text-base resize-none"
            disabled={isSubmitting}
          />
          <PromptInputFooter className="px-6 py-4 border-t bg-muted/20">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-background border border-border">@Date</span>
              <span className="px-1.5 py-0.5 rounded bg-background border border-border">+Project</span>
              <span className="px-1.5 py-0.5 rounded bg-background border border-border">#Tag</span>
            </div>
            <PromptInputSubmit
              status={isSubmitting ? "submitted" : undefined}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-xl font-bold flex gap-2 items-center shadow-lg transition-all"
            >
              <Check className="h-4 w-4" /> Ready to work!
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </CardContent>
    </Card>
  )
}
