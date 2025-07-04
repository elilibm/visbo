"use client";
import { useState } from "react";

export default function VisionRow({ goal }: { goal: string }) {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: goal })
      });
      const { image, error } = await res.json();
      if (error) throw new Error(error);
      setImg(image);
    } catch (e) {
      alert(`Image generation failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl p-4 shadow">
      <p className="text-center font-medium">{goal}</p>

      {img ? (
        <img
          src={img}
          alt={goal}
          className="h-40 w-40 rounded-xl object-cover"
        />
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-xl border px-4 py-2"
        >
          {loading ? "Please wait…" : "Generate image"}
        </button>
      )}
    </div>
  );
}
