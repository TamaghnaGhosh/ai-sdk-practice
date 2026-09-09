import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  createTextStreamResponse,
  Output,
  streamText,
  toTextStream,
} from "ai";
import { recipeSchema } from "./schema";

const router = createOpenRouter({
  apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dish = typeof body === "string" ? body : body?.dish;

    if (typeof dish !== "string" || !dish.trim()) {
      return Response.json({ error: "dish is required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: "API key is not configured" },
        { status: 500 },
      );
    }

    const result = streamText({
      model: router("openrouter/free"),
      prompt: `Generate a recipe for ${dish.trim()}`,
      output: Output.object({
        schema: recipeSchema,
      }),
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Error streaming recipe:", error);
    return new Response("Failed to stream recipe", { status: 500 });
  }
}
