import {
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const router = createOpenRouter({
  apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      // model: router("nvidia/nemotron-3-ultra-550b-a55b:free"),
      model: router("openrouter/free"),
      prompt,
      maxRetries: 3,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
