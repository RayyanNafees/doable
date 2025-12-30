"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const router = useRouter()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        await processAudio(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch {
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("audio", blob)
      formData.append("userContext", JSON.stringify({})) // Mock context for now, can be expanded

      const response = await fetch("/api/ai/process-goal", {
        method: "POST",
        body: formData, // fetch automatically sets Content-Type to multipart/form-data
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success(`Task Created: ${data.task.title}`)

      // Play the audio response
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`)
        audio.play()
      }

      router.refresh()
    } catch (err) {
      console.error("Process Audio Error:", err)
      const msg = err instanceof Error ? err.message : "Failed to process audio"
      toast.error(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <Button
          variant="destructive"
          size="icon"
          onClick={stopRecording}
          className="animate-pulse"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="icon"
          onClick={startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      )}
      {isRecording && <span className="text-xs font-medium text-destructive">Recording...</span>}
      {isProcessing && <span className="text-xs font-medium text-muted-foreground">AI is thinking...</span>}
    </div>
  )
}
