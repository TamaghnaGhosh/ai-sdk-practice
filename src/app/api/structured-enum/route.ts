import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";


const router = createOpenRouter({
  apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return Response.json({ error: "text is required" }, { status: 400 });
    }

    const result = await generateText({
      model: router("openrouter/free"),
      output: Output.choice({
        options: ["positive", "negative", "neutral"],
      }),
      prompt: `Classify the sentiment of the following text. Return exactly one lowercase word, choosing only positive, negative, or neutral. Do not include Markdown or an explanation.

    Text: ${text.trim()}`,
    });

    return Response.json({ sentiment: result.output });
  } catch (error) {
    console.error("Error generating sentiment:", error);
    return new Response("Failed to generate sentiment", { status: 500 });
  }
}
