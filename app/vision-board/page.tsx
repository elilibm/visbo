"use client";

import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* 1. Goal categories shown in the table                                      */
/* -------------------------------------------------------------------------- */

const categories = [
  "personal growth",
  "health and fitness",
  "career and ambition",
  "wealth",
  "meaning and spirituality",
  "relationships",
  "environment and lifestyle",
  "travel",
  "hobbies",
  "legacy and contribution"
] as const;

/* -------------------------------------------------------------------------- */
/* 2. Vision-Board page component                                             */
/* -------------------------------------------------------------------------- */

export default function Page() {
  /* ------------- state --------------------------------------------------- */
  const [goals, setGoals] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);

  /* ------------- helpers ------------------------------------------------- */
  const handleChange = (cat: string, val: string) => {
    setGoals((p) => ({ ...p, [cat]: val }));
    const len = val.trim().length;
    setStatus((p) => ({
      ...p,
      [cat]: len === 0 ? "blank" : len >= 40 ? "valid" : "invalid"
    }));
  };

  const css = (s?: string) =>
    s === "valid"
      ? "border-green-500 bg-green-50"
      : s === "invalid"
      ? "border-red-500 bg-red-50"
      : "border-gray-300 bg-white";

  /* ---------------------------------------------------------------------- */
  /* 3. Submit handler – one collage image                                  */
  /* ---------------------------------------------------------------------- */
  const handleSubmit = async () => {
    setCollageUrl(null);
    setLoading(true);

    try {
      /* Build a single descriptive prompt */
      const bullets = categories.map((cat) => {
        const goal = goals[cat]?.trim() || "no specific goal provided";
        return `• ${cat.toUpperCase()}: ${goal}`;
      });

      const prompt = [
        "Create a single high-resolution VISION BOARD collage for the year 2025.",
        "The board should resemble a physical scrapbook page with torn-paper edges,",
        "Polaroid frames, tape strips, doodles, pastel background and a cohesive",
        "palette. Visually represent each goal below with 2-3 mini-photos or icons,",
        "arranged artistically around the page:",
        "",
        ...bullets,
        "",
        'Add a playful, hand-cut paper headline: "VISION BOARD 2025".',
        "Ensure all categories are clearly visible; avoid empty gaps."
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

  /* ---------------------------------------------------------------------- */
  /* 4. Render                                                              */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Vision Board 2025 – Input Your Goals
      </h1>

      {/* --------- goals input table ------------------------------------- */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Category</th>
            <th className="p-4">Your Goal</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat}>
              <td className="p-4 align-top font-medium capitalize">{cat}</td>
              <td className="p-4">
                <textarea
                  placeholder={`Enter your goal for ${cat}`}
                  value={goals[cat] || ""}
                  onChange={(e) => handleChange(cat, e.target.value)}
                  className={`w-full min-h-[60px] resize-none rounded-md border p-2 ${css(
                    status[cat]
                  )}`}
                />
                {status[cat] === "invalid" && (
                  <p className="text-sm text-red-500 mt-1">
                    Please add more detail (≥ 40 chars).
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --------- generate button --------------------------------------- */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Vision Board"}
        </button>
      </div>

      {/* --------- collage display --------------------------------------- */}
      {collageUrl && (
        <div className="mt-10 flex justify-center">
          <img
            src={collageUrl}
            alt="vision-board-2025-collage"
            className="max-w-full h-auto rounded shadow-xl"
          />
        </div>
      )}
    </div>
  );
}
