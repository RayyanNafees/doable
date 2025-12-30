import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Use Gemini directly instead of depending on proper Python backend setup
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `You are a helpful Personal Productivity Assistant. 
      User says: "${message}"
      
      Respond in a motivating, concise, and helpful manner.
      If asked about tasks, say you can help organize them.
      If asked about philosophy or Ikigai, be deep and reflective.
      `,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat AI Error:", error)
    return Response.json({ response: "I'm having trouble thinking right now." }, { status: 500 })
  }
}
