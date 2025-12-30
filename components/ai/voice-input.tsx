"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

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
      formData.append("userContext", JSON.stringify({}))

      const response = await fetch("/api/ai/process-goal", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success(`Task Created: ${data.task.title}`, {
        icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
      })

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
    <div className="flex items-center gap-3">
      <div className="relative flex items-center">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-0 rounded-full bg-red-500"
            />
          )}
        </AnimatePresence>

        <Button
          variant={isRecording ? "destructive" : "secondary"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 h-10 w-10 rounded-full shadow-lg transition-all duration-300 ${isRecording ? "scale-110 ring-2 ring-red-500 ring-offset-2" : "hover:scale-105"
            } ${isProcessing ? "opacity-90" : ""}`}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <Square className="h-4 w-4 fill-current" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 1].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                  className="w-1 rounded-full bg-red-500"
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-red-500">Listening...</span>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-sm font-semibold text-transparent">
              AI Is Thinking...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

