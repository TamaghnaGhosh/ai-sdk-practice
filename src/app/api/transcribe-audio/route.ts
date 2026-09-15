import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { transcribe } from "ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // Get the audio file from the request
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response("No audio file provided", { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const transcript = await transcribe({
      model: google.transcription("gemini-3.6-flash"),
      audio: uint8Array,
    });

    return Response.json(transcript);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return new Response("Failed to transcribe audio", { status: 500 });
  }
}
