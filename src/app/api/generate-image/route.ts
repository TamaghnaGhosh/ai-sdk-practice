const imageWorkerUrl = "https://image-api.tamaghnaghosh.workers.dev/";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env["API_KEY"];

    if (!apiKey) {
      return Response.json(
        { error: "API_KEY is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(imageWorkerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Image worker error:", response.status, error);
      return Response.json(
        { error: "Image generation failed" },
        { status: response.status },
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
