"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, Sparkles, User, Check, X, Calendar, Loader2 } from "lucide-react"
import { createTask as createTaskAction } from "@/app/actions/tasks"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: 'call' | 'result'
  result?: {
    success: boolean
    message?: string
    error?: string
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolInvocations?: ToolInvocation[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Doable, your personal productivity coach. I can help you manage tasks, find your Ikigai, or just stay motivated. What's on your mind?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleToolApproval = async (toolCallId: string, toolName: string, args: Record<string, unknown>) => {
    if (toolName === "createTask") {
      try {
        const result = await createTaskAction(args as Parameters<typeof createTaskAction>[0])

        setMessages(prev => prev.map(m => {
          if (!m.toolInvocations) return m
          return {
            ...m,
            toolInvocations: m.toolInvocations.map(t => {
              if (t.toolCallId === toolCallId) {
                return {
                  ...t,
                  state: 'result',
                  result: result.success
                    ? { success: true, message: "Task created successfully" }
                    : { success: false, error: result.error || "Failed to create task" }
                }
              }
              return t
            })
          }
        }))

        if (result.success) {
          toast.success(`Task created: ${(args as { title: string }).title}`, {
            icon: <Sparkles className="h-4 w-4 text-yellow-500" />
          })
        } else {
          toast.error(result.error || "Failed to create task")
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
        console.error(error)
      }
    }
  }

  const handleToolRejection = (toolCallId: string) => {
    setMessages(prev => prev.map(m => {
      if (!m.toolInvocations) return m
      return {
        ...m,
        toolInvocations: m.toolInvocations.map(t => {
          if (t.toolCallId === toolCallId) {
            return {
              ...t,
              state: 'result',
              result: { success: false, message: "User cancelled the task creation" }
            }
          }
          return t
        })
      }
    }))
    toast.info("Task creation cancelled")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // TODO: Implement actual AI response logic here
    // For now, we'll simulate a simple response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've received your message. The AI logic is currently being implemented. Check back soon!"
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Card className="flex flex-col h-[700px] w-full max-w-4xl mx-auto shadow-2xl border-border/40 bg-background/50 backdrop-blur-xl relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 z-20" />

      <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-muted/30 space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Bot className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Doable Assistant</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Productivity Mode</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 py-6">
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-4 w-full",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role !== "user" && (
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-indigo-500/10 text-indigo-500">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  m.role === "user" ? "items-end" : "items-start"
                )}>
                  {m.content && (
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20"
                          : "bg-muted/50 border border-border/50 rounded-tl-none shadow-sm"
                      )}
                    >
                      {m.content}
                    </div>
                  )}

                  {/* Tool Invocations */}
                  {m.toolInvocations?.map((mTool) => {
                    // Adapted for local state structure
                    const { toolCallId, toolName, state, args } = mTool

                    if (toolName === 'createTask') {
                      return (
                        <div key={toolCallId} className="w-full mt-2 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3 shadow-sm">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            Confirm Task Creation
                          </div>

                          <div className="bg-background/60 p-3 rounded-lg border border-border/40">
                            <p className="text-sm font-bold text-foreground">{(args as { title: string }).title}</p>
                            {(args as { description?: string }).description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {(args as { description: string }).description}
                              </p>
                            )}
                          </div>

                          {state === 'call' ? (
                            <div className="flex gap-2 pt-1">
                              <Button
                                size="sm"
                                onClick={() => handleToolApproval(toolCallId, toolName, args)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 h-8"
                              >
                                <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToolRejection(toolCallId)}
                                className="px-4 text-xs font-bold h-8"
                              >
                                <X className="h-3.5 w-3.5 mr-1.5" /> Skip
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 w-fit px-2 py-1 rounded">
                              <Check className="h-2.5 w-2.5" /> Task Created
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                {m.role === "user" && (
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 w-full justify-start">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-indigo-500/10 text-indigo-500">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/50 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground ml-2 animate-pulse">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 bg-muted/10 border-t">
        <form onSubmit={handleSubmit} className="w-full relative flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (e.g. 'Create a task to buy groceries')"
            className="min-h-[50px] max-h-[150px] resize-none pr-12 text-sm bg-background/50 focus-visible:ring-indigo-500/30"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={cn(
              "absolute right-2 bottom-2 rounded-xl h-8 w-8 transition-all duration-300",
              input.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" : "bg-muted text-muted-foreground"
            )}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
