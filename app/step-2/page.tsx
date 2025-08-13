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
    s === "valid" ? "bg-[#C4EDEE]": s === "invalid" ? "bg-[#FFDFE9]" : "bg-[#F5F5F5]";

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
    <div className="min-h-screen bg-white pr-[20%] pl-[20%] pt-[8%] pb-[5%]">
      <div className="pb-[3%] pl-[1%]">
      <svg
          width="27"
          height="27"
          viewBox="0 0 46 43"
          fill="#FF6021"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
        >
          <path d="M22.5 43L3.01443 21.25L41.9856 21.25L22.5 43Z" />
          <path d="M22.7681 12.1316C22.7681 10.5384 22.478 8.96089 21.9142 7.48902C21.3504 6.01715 20.524 4.67978 19.4823 3.55325C18.4406 2.42673 17.2038 1.53313 15.8427 0.923461C14.4817 0.313792 13.0228 0 11.5496 0 10.0764 0 8.61754 0.313792 7.25645 0.923461 5.89535 1.53313 4.65863 2.42673 3.61689 3.55326 2.57515 4.67978 1.7488 6.01715 1.18502 7.48902 0.621231 8.96089 0.331055 10.5384 0.331055 12.1316L11.5496 12.1316H22.7681Z" />
          <path d="M45.2056 12.1316C45.2056 10.5384 44.9155 8.96089 44.3517 7.48902 43.7879 6.01715 42.9615 4.67978 41.9198 3.55325 40.8781 2.42673 39.6413 1.53313 38.2802 0.923461 36.9192 0.313792 35.4603 0 33.9871 0 32.5139 0 31.055 0.313792 29.6939 0.923461 28.3329 1.53313 27.0961 2.42673 26.0544 3.55326 25.0127 4.67978 24.1863 6.01715 23.6225 7.48902 23.0587 8.96089 22.7686 10.5384 22.7686 12.1316L33.9871 12.1316H45.2056Z" />
          <rect x="0.331055" y="11.8495" width="44.8742" height="4.7962" />
        </svg>
        </div>
      <div className="dmsans text-4xl font-bold pl-[1%] ">See your vision come to life.</div>
      <p className=" text-neutral-600 text-md font-light pt-[1%] pb-[4%] pl-[1%]">
        Add descriptions about your visions to each category. <br/>
        The more detail the better. </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {categories.map((cat) => (
            <div
            key={cat}
            className={`p-4 rounded-3xl ${css(status[cat])}`}
            >
            <label className="block text-neutral-600 capitalize pl-2 pt-2">
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
                className={`w-full min-h-[50px] resize-none pl-2 pt-1.5 font-light text-sm focus:outline-none focus:ring-0  ${css(
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
      <div className="mt-6 text-right pt-[1%]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="hover:bg-[#FF4F87] bg-[#FF6021] text-white font-light py-3 px-6 rounded-3xl disabled:opacity-50"
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
