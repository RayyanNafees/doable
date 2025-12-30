"use client"

import { useState } from "react"
import { Card,  CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ClipboardList, CheckCircle2, Link2, RefreshCw, Loader2 } from "lucide-react"
import { toggleIntegration, syncIntegration } from "@/app/actions/integrations"
import { toast } from "sonner"

const initialIntegrations = [
  { id: "Email", icon: Mail, description: "Automatically update tasks from received emails.", status: "Connected" },
  { id: "ClickUp", icon: ClipboardList, description: "Sync tasks and projects with ClickUp.", status: "Disconnected" },
  { id: "Todoist", icon: CheckCircle2, description: "Import and sync your Todoist tasks.", status: "Disconnected" },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [isSyncing, setIsSyncing] = useState<string | null>(null)

  const handleToggle = async (id: string, currentStatus: string) => {
    const result = await toggleIntegration(id, currentStatus)
    if (result.success) {
      setIntegrations(prev => prev.map(item =>
        item.id === id ? { ...item, status: result.data as string } : item
      ))
      toast.success(`${id} ${result.data === "Connected" ? "connected" : "disconnected"}`)
    }
  }

  const handleSync = async (id: string) => {
    setIsSyncing(id)
    const result = await syncIntegration(id)
    if (result.success) {
      toast.success(`${id} synchronized successfully`)
    } else {
      toast.error(`Failed to sync ${id}`)
    }
    setIsSyncing(null)
  }

  return (
    <div className="p-4 overflow-auto">
      <div className="mx-auto max-w-4xl w-full space-y-8 py-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Neural Bridge</h1>
          <p className="text-sm text-muted-foreground">
            Synching your external ecosystem with Doable&apos;s intelligence.
          </p>
        </div>

        <div className="grid gap-6">
          {integrations.map((app) => {
            const Icon = app.icon
            const isConnected = app.status === "Connected"
            return (
              <Card key={app.id} className={`overflow-hidden border-2 transition-all ${isConnected ? "border-primary/20 bg-primary/5 shadow-md" : "border-border shadow-sm"}`}>
                <CardHeader className="flex flex-row items-center gap-6 py-6 px-8">
                  <div className={`p-4 rounded-2xl transition-colors ${isConnected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold">{app.id}</CardTitle>
                    <CardDescription className="text-sm mt-1">{app.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isConnected ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                      {app.status}
                    </span>
                  </div>
                </CardHeader>
                <CardFooter className="py-4 px-8 bg-muted/30 flex justify-end gap-3 border-t">
                  {isConnected ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 text-xs font-bold uppercase tracking-widest"
                        onClick={() => handleSync(app.id)}
                        disabled={isSyncing === app.id}
                      >
                        {isSyncing === app.id ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-3 w-3" />
                        )}
                        Sync Data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10"
                        onClick={() => handleToggle(app.id, app.status)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-10 text-xs font-bold uppercase tracking-widest px-6"
                      onClick={() => handleToggle(app.id, app.status)}
                    >
                      <Link2 className="mr-2 h-3 w-3" />
                      Establish Link
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
