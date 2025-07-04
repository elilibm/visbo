import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID      // comment out if you use sk-live-… key
});

/* -------------------------------------------------------------------------- */
/* POST /api/generate                                                          */
/* body: { prompt: string, numImages?: number }                                */
/* returns: { images: string[] } or { error: string }                          */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const { prompt, numImages = 1 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "No prompt supplied" }, { status: 400 });
    }

    const images: string[] = [];

    /* DALL·E 3 → one request per image */
    const total = Math.max(1, Math.min(numImages, 10)); // safety cap

    for (let i = 0; i < total; i++) {
      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,                       // must be 1
        size: "1024x1024",
        response_format: "b64_json"
      });

      if (!result.data || !result.data[0]) {
        throw new Error("Unexpected response format from OpenAI");
      }
      const b64 = (result.data[0] as any).b64_json as string;
      images.push(`data:image/png;base64,${b64}`);
    }

    return NextResponse.json({ images });
  } catch (err) {
    /* Forward OpenAI error message */
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
