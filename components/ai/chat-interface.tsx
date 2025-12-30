"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "@ai-sdk/react"
import { Card } from "@/components/ui/card"
import { Bot, Send, Sparkles, Calendar, Check, X } from "lucide-react"
import { createTask as createTaskAction } from "@/app/actions/tasks"
import { toast } from "sonner"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState
} from "@/components/ai-elements/conversation"
import {
  Message as MessageComponent,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  PromptInputButton
} from "@/components/ai-elements/prompt-input"
import { Loader } from "@/components/ai-elements/loader"

export function ChatInterface() {
  const [input, setInput] = useState("")

  const { messages, status, sendMessage, addToolOutput } = useChat({
    api: "/api/ai/chat",
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "Hi! I'm Doable, your personal productivity coach. I can help you manage tasks, find your Ikigai, or just stay motivated. What's on your mind?"
      }
    ],
  })

  const isLoading = status === "submitted" || status === "streaming"

  const handleToolApproval = async (toolCallId: string, toolName: string, args: Record<string, unknown>) => {
    if (toolName === "createTask") {
      try {
        const result = await createTaskAction(args as Parameters<typeof createTaskAction>[0])
        if (result.success) {
          toast.success(`Task created: ${(args as { title: string }).title}`, {
            icon: <Sparkles className="h-4 w-4 text-yellow-500" />
          })
          // Add tool output to continue the conversation
          addToolOutput({
            tool: toolName,
            toolCallId,
            output: { success: true, message: "Task created successfully" }
          })
        } else {
          toast.error(result.error || "Failed to create task")
          addToolOutput({
            tool: toolName,
            toolCallId,
            state: "output-error",
            errorText: result.error || "Failed to create task"
          })
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
        addToolOutput({
          tool: toolName,
          toolCallId,
          state: "output-error",
          errorText: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }
  }

  const handleToolRejection = (toolCallId: string, toolName: string) => {
    addToolOutput({
      tool: toolName,
      toolCallId,
      state: "output-error",
      errorText: "User cancelled the task creation"
    })
    toast.info("Task creation cancelled")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput("")
  }

  return (
    <Card className="flex flex-col h-[700px] w-full max-w-4xl mx-auto shadow-2xl border border-border/40 bg-background/50 backdrop-blur-xl relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 z-20" />

      <header className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Bot className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Doable Assistant</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Productivity Mode</p>
          </div>
        </div>
        {isLoading && <Loader className="text-indigo-500" size={18} />}
      </header>

      <Conversation className="flex-1 overflow-hidden p-0 bg-transparent">
        <ConversationContent className="h-full px-6 py-8 gap-8">
          {messages.length === 0 && (
            <ConversationEmptyState
              title="Start a new plan"
              description="Tell me what you want to achieve today."
              icon={<Sparkles className="h-8 w-8 text-indigo-500/40" />}
            />
          )}

          {messages.map((m: UIMessage) => (
            <MessageComponent key={m.id} from={m.role}>
              <MessageContent>
                {m.content && <MessageResponse>{m.content}</MessageResponse>}

                {/* Tool Invocations */}
                {m.toolInvocations?.map((toolInvocation) => {
                  const { toolCallId, toolName, state, args } = toolInvocation

                  if (toolName === 'createTask') {
                    return (
                      <div key={toolCallId} className="mt-4 px-4 py-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                          <Calendar className="h-3 w-3" />
                          Confirm Task Creation
                        </div>

                        <div>
                          <p className="text-sm font-bold text-foreground">{(args as { title: string }).title}</p>
                          {(args as { description?: string }).description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {(args as { description: string }).description}
                            </p>
                          )}
                        </div>

                        {state === 'call' ? (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleToolApproval(toolCallId, toolName, args as Record<string, unknown>)}
                              className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleToolRejection(toolCallId, toolName)}
                              className="px-4 flex items-center justify-center h-9 rounded-lg border border-border bg-background hover:bg-muted text-xs font-bold transition-all"
                            >
                              <X className="h-3.5 w-3.5" /> Skip
                            </button>
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
              </MessageContent>

              {m.role === "assistant" && m.content && (
                <MessageActions>
                  <MessageAction tooltip="Copy response" onClick={() => navigator.clipboard.writeText(m.content)}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </MessageAction>
                </MessageActions>
              )}
            </MessageComponent>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-6 pt-2 bg-linear-to-t from-background via-background to-transparent border-t">
        <form onSubmit={handleSubmit}>
          <PromptInput
            className="bg-muted/30 border border-border/40 hover:border-indigo-500/30 transition-all rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20"
            onSubmit={(msg) => {
              sendMessage({ text: msg.text })
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... (e.g., 'Create a high priority task for my Ikigai project')"
              className="min-h-[100px] border-none bg-transparent focus-visible:ring-0 px-4 py-4 resize-none"
            />
            <PromptInputFooter className="px-4 py-3 items-center">
              <PromptInputTools>
                <PromptInputButton>
                  <Sparkles className="h-4 w-4" />
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                status={isLoading ? "streaming" : undefined}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 w-10 shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="h-4 w-4" />
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </form>
      </div>
    </Card>
  )
}
