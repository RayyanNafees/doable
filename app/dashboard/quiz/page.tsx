"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitPsychologyQuiz } from "@/app/actions/psychology"
import { getOrCreateDefaultUser } from "@/app/actions/users"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  {
    title: "Your Ikigai",
    description: "What is your reason for being? What drives you every morning?",
    fields: ["love", "goodAt", "needs", "paidFor"]
  },
  {
    title: "Life Goals",
    description: "What are the big milestones you want to achieve?",
    fields: ["goals"]
  },
  {
    title: "Psychology Quiz",
    description: "Help us understand how you work.",
    questions: [
      { id: "work_style", label: "How do you prefer to work?", options: ["Deep focus blocks", "Short bursts", "Steady pace"] },
      { id: "pressure", label: "How do you handle urgent tasks?", options: ["Thrive on it", "Get stressed", "Calculated response"] },
      { id: "delay", label: "Why do you usually delay tasks?", options: ["Procrastination", "Overwhelmed", "Lacking clarity"] }
    ]
  }
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    love: "",
    goodAt: "",
    needs: "",
    paidFor: "",
    goals: "",
    quizResults: {} as Record<string, string>
  })

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getOrCreateDefaultUser()
      setUserId(user._id)
      if (user.ikigai && (user.lifeGoals?.length ?? 0) > 0) {
        // router.push("/dashboard") // Allow re-taking the quiz if they want
      }
    }
    fetchUser()
  }, [])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User not found")
      return
    }

    const ikigai = `I love ${formData.love}, I'm good at ${formData.goodAt}, the world needs ${formData.needs}, and I can be paid for ${formData.paidFor}.`
    const lifeGoals = formData.goals.split("\n").filter(g => g.trim())

    const result = await submitPsychologyQuiz({
      userId,
      ikigai,
      lifeGoals,
      quizResults: formData.quizResults
    })

    if (result.success) {
      toast.success("Psychology profile updated!")
      router.push("/dashboard")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to submit quiz")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>{steps[step].title}</CardTitle>
              <CardDescription>{steps[step].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>What do you love?</Label>
                    <Input
                      placeholder="e.g. Coding, Helping others, Design"
                      value={formData.love}
                      onChange={(e) => setFormData({ ...formData, love: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>What are you good at?</Label>
                    <Input
                      placeholder="e.g. Solving logic puzzles, empathetic listening"
                      value={formData.goodAt}
                      onChange={(e) => setFormData({ ...formData, goodAt: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>What does the world need?</Label>
                    <Input
                      placeholder="e.g. Better productivity tools, awareness"
                      value={formData.needs}
                      onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>What can you be paid for?</Label>
                    <Input
                      placeholder="e.g. Software Development, Coaching"
                      value={formData.paidFor}
                      onChange={(e) => setFormData({ ...formData, paidFor: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-2">
                  <Label>List your life goals (one per line)</Label>
                  <Textarea
                    placeholder="Build a successful company&#10;Run a marathon&#10;Learn to play piano"
                    rows={6}
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {steps[2].questions?.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <Label>{q.label}</Label>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => (
                          <Button
                            key={opt}
                            variant={formData.quizResults[q.id] === opt ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFormData({
                              ...formData,
                              quizResults: { ...formData.quizResults, [q.id]: opt }
                            })}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t mt-6 pt-6">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
                Back
              </Button>
              <Button onClick={handleNext}>
                {step === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
