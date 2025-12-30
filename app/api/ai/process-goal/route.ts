import { GoogleGenAI } from "@google/genai"
import "@/lib/models/connect"
import { Task } from "@/lib/models/Task"
import { getOrCreateDefaultUser } from "@/app/actions/users"

export const runtime = "nodejs"

// Define the schema for the task extraction
const TaskSchema = {
  type: "OBJECT",
  properties: {
    task: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        description: { type: "STRING" },
        why: { type: "STRING", description: "A motivating 'Why' for this task." },
        effortEstimateMins: { type: "NUMBER" },
        priority: { type: "NUMBER" }, // 1-5
        eisenhowerQuadrant: {
          type: "STRING",
          enum: ['Urgent & Important', 'Not Urgent & Important', 'Urgent & Not Important', 'Not Urgent & Not Important']
        },
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
      },
      required: ["title", "priority", "eisenhowerQuadrant"]
    },
    speechText: { type: "STRING", description: "A short, encouraging response to speak back to the user confirming the task details." }
  },
  required: ["task", "speechText"]
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as Blob
    const userContextStr = formData.get("userContext") as string

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString("base64")

    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY as string })

    // Step 1: Understand Audio and Create Task JSON
    console.log("Starting Audio Understanding with gemini-2.5-flash...")
    const understandResponse = await client.models.generateContent({
      model: "gemini-2.5-flash",
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
User Context: ${userContextStr || "{}"}
Rules:
1. Be motivational.
2. If the user mentions a time, include it in the description.
3. For the 'Why', align it with the user context if available.`
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

    resultText = resultText.replace(/```json\n?|```/g, "").trim()

    let resultJson
    try {
      resultJson = JSON.parse(resultText)
    } catch {
      console.error("Failed to parse AI JSON:", resultText)
      throw new Error("AI returned invalid JSON data.")
    }

    const { task, speechText } = resultJson

    // Step 2: Save to Database
    const user = await getOrCreateDefaultUser()
    interface Substep {
      title: string;
      durationMins: number;
    }

    const newTask = await Task.create({
      ...task,
      userId: user._id,
      substeps: (task.substeps as Substep[] | undefined)?.map((sValue: Substep) => ({ ...sValue, isCompleted: false })) || []
    })

    // Step 3: Generate Speech (TTS)
    const ttsResponse = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            { text: speechText || `I've added the task: ${task.title}.` }
          ]
        }
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore"
            }
          }
        }
      }
    })

    const ttsData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

    return Response.json({
      task: newTask,
      audio: ttsData // Base64 audio string
    })

  } catch (error: any) {
    console.error("AI Error:", error)

    // Check for Quota/Rate Limit errors
    if (error.status === "RESOURCE_EXHAUSTED" || error.code === 429 || (error.message && error.message.includes("quota"))) {
      return Response.json({
        error: "AI Quota Exceeded. Please try again in a few minutes or switch to a different model tier."
      }, { status: 429 })
    }

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
