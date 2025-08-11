"use client";

import { useState } from "react";
import Image from "next/image";

const categories = [
  "personal growth",
  "health and fitness",
  "career and ambition",
  "wealth",
  "meaning and spirituality",
  "relationships",
  "travel",
  "hobbies",
] as const;


export default function Page() {
  const [goals, setGoals] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);

  const handleChange = (cat: string, val: string) => {
    setGoals((p) => ({ ...p, [cat]: val }));
    const len = val.trim().length;
    setStatus((p) => ({
      ...p,
      [cat]: len === 0 ? "blank" : len >= 40 ? "valid" : "invalid"
    }));
  };

  const css = (s?: string) =>
    s === "valid" ? "bg-[#C4EDEE]": s === "invalid" ? "bg-[#FFDFE9]" : "bg-gray-100";

  const handleSubmit = async () => {
    setCollageUrl(null);
    setLoading(true);

    try {
      const bullets = categories.map((cat) => {
        const goal = goals[cat]?.trim() || "no specific goal provided";
        return `• ${cat.toUpperCase()}: ${goal}`;
      });

      const prompt = [
        "Generate a single high-resolution **vision board collage** for the year 2025.",
        "Design the layout like a real-world **handmade vision board or scrapbook**, placed on a neutral, textured background (like corkboard or craft paper).",
        "",
        "The style should be cozy, aesthetic, and modern: pastel tones, paper cutouts, Polaroid-style frames, masking tape, doodles, magazine clippings, and organic torn-paper edges. Use a matte finish and soft lighting.",
        "",
        "Each category below must be visually represented using **2–3 symbolic or literal visuals per category** (such as scenes, objects, symbols).",
        "Draw inspiration from real-world metaphors, *not generic clipart*.",
        "",
        "✅ **Do NOT use any text in the image**, except for the title **'VISION BOARD 2025'** in a papercut or handwritten style at the top center.",
        "❌ No category names, labels, or captions.",
        "✅ For any people shown, use stylized **faceless mannequins**, silhouettes, or back-facing figures only — avoid eyes, mouths, or realistic facial features.",
        "",
        "Use visual storytelling and metaphor to reflect the user’s ACTUAL goals:",
        ...bullets,
        "",
        "Place the visuals in an **artistic, balanced collage format**, with natural overlaps, layers, and taped corners — no grid or boxy layout.",
        "Avoid empty space. The collage should feel complete, intentional, and curated.",
        "",
        "Use props like flowers, Polaroid borders, pins, tape, torn paper, plants, and paint swatches to decorate the layout without cluttering the main visuals.",
        "",
        "The result should look like a physical collage made by someone manifesting their dream life in 2025.",
        "",
        "Style keywords: vision board, soft scrapbook, handmade, pastel aesthetic, Pinterest layout, cozy, faceless figures, realistic objects, metaphors, matte finish, layered textures."
      ].join("\n");
      

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, numImages: 1 })
      });

      if (!res.ok)
        throw new Error(`API ${res.status}: ${await res.text().catch(() => "")}`);

      const { images, error } = (await res.json()) as {
        images?: string[];
        error?: string;
      };

      if (error) throw new Error(error);
      if (!images || images.length === 0) throw new Error("No image returned");

      setCollageUrl(images[0]);
    } catch (err) {
      alert((err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div> 
        <Image src="/img/logo.svg" alt="Visbo Logo" width={37.2} height={33} />
    <div className="min-h-screen bg-white pr-[10%] pl-[8%] pt-[8%] pb-[5%]">
      <div className="title pl-[1%] ">See your vision come to life.</div>
      <p className="description pt-[1%] pb-[4%] pl-[1%]">Fill in as many categories as you can. Add lots of detail to make your images more accurate. When you are done, click generate. </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {categories.map((cat) => (
            <div
            key={cat}
            className={`p-4 rounded-3xl ${css(status[cat])}`}
            >
            <label className="block font-medium capitalize pl-2 pb-2">
                {cat}
            </label>
            <textarea
                ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                  }}
                placeholder={`Enter your goal for ${cat}`}
                value={goals[cat] || ""}
                onChange={(e) => handleChange(cat, e.target.value)}
                className={`w-full min-h-[60px] resize-none rounded-xl p-2 font-light focus:outline-none focus:ring-0  ${css(
                status[cat]
                )}`}
            />
            {status[cat] === "invalid" && (
                <p className="text-sm text-[#FF4F87] mt-1 font-light">
                Please add more detail for an accurate board.
                </p>
            )}
            </div>
        ))}
        </div>
      <div className="mt-6 text-center pt-[2%]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="hover:bg-[#FF4F87] bg-black text-white font-light py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Visbo"}
        </button>
      </div>

      {collageUrl && (
        <div className="mst-10 flex justify-center">
          <img
            src={collageUrl}
            alt="vision-board-2025-collage"
            className="max-w-full h-auto rounded shadow-xl"
          />
        </div>
      )}
    </div>
    </div>
  );
}
