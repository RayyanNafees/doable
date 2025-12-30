import { GoogleGenAI } from "@google/genai"


export const runtime = "nodejs" // Switch to nodejs to ensure full buffer support if needed, though edge might work with GenAI SDK, nodejs is safer for file handling

// Define the schema for the task extraction
const TaskSchema = {
  type: "OBJECT",
  properties: {
    task: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        description: { type: "STRING" },
        effortEstimateMins: { type: "NUMBER" },
        priority: { type: "NUMBER" }, // 1-5
        substeps: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              durationMins: { type: "NUMBER" }
            }
          }
        }
      }
    },
    speechText: { type: "STRING", description: "A short, encouraging response to speak back to the user confirming the task details." }
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as Blob
    const userContextStr = formData.get("userContext") as string
    // const userContext = userContextStr ? JSON.parse(userContextStr) : {}

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString("base64")

    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY as string })

    // Step 1: Understand Audio and Create Task JSON
    console.log("Starting Audio Understanding with gemini-2.0-flash-exp...")
    const understandResponse = await client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        responseMimeType: "application/json",
        responseSchema: TaskSchema,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI Productivity Agent. 
Listen to the user's audio request. 
Extract the task details into the specified JSON structure. 
Generate a short, natural, encouraging 'speechText' that you would say to confirm the action.
User Context: ${userContextStr || "{}"}`
            },
            {
              inlineData: {
                mimeType: audioFile.type || "audio/wav",
                data: base64Audio
              }
            }
          ]
        }
      ]
    })

    if (!understandResponse.candidates || understandResponse.candidates.length === 0) {
      console.error("No candidates returned from Understand Audio:", JSON.stringify(understandResponse))
      throw new Error("AI failed to generate a response for the audio input.")
    }

    let resultText = understandResponse.candidates[0].content?.parts?.[0]?.text
    if (!resultText) {
      console.error("Empty text in candidate:", JSON.stringify(understandResponse.candidates[0]))
      throw new Error("AI understood the audio but failed to generate structured text.")
    }

    // Clean JSON if needed
    resultText = resultText.replace(/```json\n?|```/g, "").trim()

    let resultJson
    try {
      resultJson = JSON.parse(resultText)
    } catch {
      console.error("Failed to parse AI JSON:", resultText)
      throw new Error("AI returned invalid JSON data.")
    }

    const { task, speechText } = resultJson

    // Step 2: Generate Speech (TTS)
    const ttsResponse = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            { text: speechText || "I've added that task for you." }
          ]
        }
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore" // "Firm" - sounds professional for a productivity agent, or maybe "Puck" (Upbeat)
            }
          }
        }
      }
    })

    const ttsData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

    return Response.json({
      task,
      audio: ttsData // Base64 audio string
    })

  } catch (error) {
    console.error("AI Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
