import {
  createTextStreamResponse,
  Output,
  streamText,
  toTextStream,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { pokemonSchema } from "./schema";


const router = createOpenRouter({
  apiKey: process.env["OPENROUTER_API_KEY"] ?? "",
});


export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const result = streamText({
      model: router("openrouter/free"),
      output: Output.array({
        element: pokemonSchema,
      }),
      prompt: `Generate exactly 5 ${type} type Pokemon. Return only a valid JSON array. Each item must have this shape: {"name":"Pokemon name","abilities":["ability 1","ability 2"]}. Do not include Markdown, numbering, or any explanation.`,
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Error generating pokemon:", error);
    return new Response("Failed to generate pokemon", { status: 500 });
  }
}