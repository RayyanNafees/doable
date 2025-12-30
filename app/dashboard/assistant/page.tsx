import { ChatInterface } from "@/components/ai/chat-interface"

export default function AssistantPage() {
  return (
    <div className="p-4 flex flex-col h-[calc(100vh-5rem)]">
      <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Your AI Productivity Coach</h1>
          <p className="text-sm text-muted-foreground">
            Ask about your tasks, schedule meetings, or get some motivation.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}
