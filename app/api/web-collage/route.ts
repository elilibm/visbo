import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import sharp from "sharp";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  project: process.env.OPENAI_PROJECT_ID,
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

/* --------------------------- providers --------------------------- */

async function pexelsUrls(query: string, n: number): Promise<string[]> {
  if (!PEXELS_API_KEY) return [];
  try {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", String(Math.min(n, 40)));
    url.searchParams.set("orientation", "square");
    const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY }, cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.photos || [])
      .map((p: any) => p?.src?.large || p?.src?.medium || p?.src?.original)
      .filter(Boolean)
      .slice(0, n);
  } catch {
    return [];
  }
}

async function unsplashUrls(query: string, n: number): Promise<string[]> {
  // Source returns random 302, we’ll fetch directly later
  const list: string[] = [];
  for (let i = 0; i < n; i++) {
    list.push(`https://source.unsplash.com/1024x1024/?${encodeURIComponent(query)}&sig=${i + 1}`);
  }
  return list;
}

function buildQuery(cat: string, goal?: string) {
  return [
    cat,
    goal || "",
    "aesthetic lifestyle photography natural light pastel",
    "no text not poster not typography",
  ].join(" ").replace(/\s+/g, " ").trim();
}

/* --------------------------- OpenAI singles --------------------------- */

function singlePhotoPrompt(cat: string, goal?: string) {
  return [
    "Create ONE single square photograph-style image.",
    "It must be a single subject/scene (NOT a collage, montage, grid, or mood board).",
    "Absolutely NO text, labels, or typography.",
    "Natural lighting, cozy pastel aesthetic, realistic textures, matte finish.",
    "If any people appear, show back-facing or faceless silhouettes only.",
    `Theme: ${cat}.`,
    goal ? `Inspiration from this user goal: ${goal}` : "",
  ].filter(Boolean).join("\n");
}

async function genOne(prompt: string): Promise<Buffer | null> {
  try {
    const r = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    const b64 = (r?.data?.[0] as any)?.b64_json as string | undefined;
    return b64 ? Buffer.from(b64, "base64") : null;
  } catch {
    return null;
  }
}

/* ------------------------------ helpers ------------------------------ */

async function fetchToBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "follow" });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function hash(buf: Buffer) {
  return crypto.createHash("sha1").update(buf).digest("hex");
}

async function getWebBuffers(cat: string, goal: string | undefined, n: number, seen: Set<string>) {
  const q = buildQuery(cat, goal);
  const urls = [
    ...(await pexelsUrls(q, n)),
    ...(await unsplashUrls(q, Math.max(0, n))), // top-up
  ];

  const out: Buffer[] = [];
  for (const u of urls) {
    const b = await fetchToBuffer(u);
    if (!b) continue;
    const h = hash(b);
    if (seen.has(h)) continue; // dedupe by content
    seen.add(h);
    out.push(b);
    if (out.length >= n) break;
  }
  return out;
}

/* ------------------------------ grid composer ------------------------------ */
/** Tight grid, tiny bleed to hide seams. No borders, no overlap. */
async function composeGrid(boardW: number, boardH: number, imgs: Buffer[]) {
  const total = imgs.length;
  const cols = total <= 8 ? 3 : total <= 16 ? 4 : total <= 25 ? 5 : 6;
  const rows = Math.ceil(total / cols);

  const bleed = 4;
  const tileW = Math.ceil(boardW / cols) + bleed * 2;
  const tileH = Math.ceil(boardH / rows) + bleed * 2;

  const canvas = sharp({
    create: { width: boardW, height: boardH, channels: 3, background: "#eae6dc" },
  }).png();

  const overlays: sharp.OverlayOptions[] = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols && i < total; c++, i++) {
      const resized = await sharp(imgs[i]).resize(tileW, tileH, { fit: "cover" }).toBuffer();
      overlays.push({
        input: resized,
        left: Math.round(c * (boardW / cols) - bleed),
        top: Math.round(r * (boardH / rows) - bleed),
      });
    }
  }
  return canvas.composite(overlays).png().toBuffer();
}

/* ---------------------------------- route ---------------------------------- */

type Body = {
  categories: string[];
  goals?: Record<string, string>;
  webPerCategory?: number;  // default 4 (dominant web)
  genPerCategory?: number;  // default 1 (small AI top-up)
  boardWidth?: number;      // default 2400
  boardHeight?: number;     // default 1700
};

export async function POST(req: NextRequest) {
  try {
    const {
      categories,
      goals = {},
      webPerCategory = 4,
      genPerCategory = 1,
      boardWidth = 2400,
      boardHeight = 1700,
    } = (await req.json()) as Body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "No categories supplied" }, { status: 400 });
    }

    const maxTiles = 48;
    const seen = new Set<string>();
    const sources: Buffer[] = [];
    let webCount = 0;
    let genCount = 0;

    // 1) Prefer MANY web images per category
    for (const cat of categories) {
      const goal = typeof goals[cat] === "string" ? goals[cat] : undefined;
      const webs = await getWebBuffers(cat, goal, webPerCategory, seen);
      sources.push(...webs);
      webCount += webs.length;
      if (sources.length >= maxTiles) break;
    }

    // 2) Small AI top-up (single-photo, no text)
    for (const cat of categories) {
      if (genCount >= genPerCategory * categories.length || sources.length >= maxTiles) break;
      const goal = typeof goals[cat] === "string" ? goals[cat] : undefined;
      const b = await genOne(singlePhotoPrompt(cat, goal));
      if (!b) continue;
      const h = hash(b);
      if (seen.has(h)) continue;
      seen.add(h);
      sources.push(b);
      genCount++;
    }

    // 3) If still short, round-robin web until target or cap
    let k = 0;
    while (sources.length < Math.min(maxTiles, categories.length * (webPerCategory + genPerCategory)) && k < 100) {
      const cat = categories[k % categories.length];
      const goal = typeof goals[cat] === "string" ? goals[cat] : undefined;
      const extra = await getWebBuffers(cat, goal, 1, seen);
      if (extra[0]) {
        sources.push(extra[0]);
        webCount++;
      }
      k++;
    }

    if (sources.length === 0) {
      return NextResponse.json({ error: "No images fetched/generated" }, { status: 500 });
    }

    const board = await composeGrid(boardWidth, boardHeight, sources.slice(0, maxTiles));
    return NextResponse.json({
      image: `data:image/png;base64,${board.toString("base64")}`,
      meta: { web: webCount, generated: genCount, total: sources.length },
    });
  } catch (err: any) {
    console.error("generate-collage error:", err?.response?.data || err);
    const msg =
      err?.error?.message ||
      err?.response?.data?.error?.message ||
      err?.message ||
      "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
