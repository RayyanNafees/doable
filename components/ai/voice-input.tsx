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
    } catch (err) {
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
      // For actual Gemini audio, we would convert to base64 or upload
      // For this demo, let's assume we transcribe text first or mock the transcription
      // In a real implementation, we'd send the blob to a route that uses Gemini 1.5

      const formData = new FormData()
      formData.append("audio", blob)

      // MOCK: Sending to process-goal with a prompt for now
      // Real would use Gemini's audio capability
      const response = await fetch("/api/ai/process-goal", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Schedule a 2-hour coding session after lunch.",
          userContext: {}
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success(`Task Created: ${data.title}`)
      router.refresh()
    } catch (err) {
      toast.error("Failed to process audio")
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
