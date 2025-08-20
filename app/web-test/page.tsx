// app/web-test/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function WebTestPage() {
  const router = useRouter();

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const cats = useMemo<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const s = sessionStorage.getItem("visbo:lastCategories");
      const v = s ? JSON.parse(s) : [];
      return Array.isArray(v) && v.length ? v : [
        "personal growth",
        "health and fitness",
        "career and ambition",
        "wealth",
        "meaning and spirituality",
        "relationships",
        "travel",
        "hobbies",
      ];
    } catch {
      return ["personal growth","health and fitness","career and ambition","wealth","meaning and spirituality","relationships","travel","hobbies"];
    }
  }, []);

  const goals = useMemo<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(sessionStorage.getItem("visbo:lastGoals") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [webPerCategory, setWebPerCategory] = useState(4);
  const [provider, setProvider] = useState<"both" | "pexels" | "unsplash">("both");

  const generate = async () => {
    setLoading(true);
    setErr(null);
    setImgUrl(null);

    try {
      const res = await fetch("/api/web-collage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: cats,
          goals,
          webPerCategory,
          boardWidth: 2400,
          boardHeight: 1700,
          provider,
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => "")}`);
      const { image, error, meta } = (await res.json()) as { image?: string; error?: string; meta?: any };
      if (error || !image) throw new Error(error || "No image returned");
      // console.log("meta:", meta);
      setImgUrl(image);
    } catch (e) {
      setErr((e as Error).message || "Failed to fetch web images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-generate on first visit
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = "vision-board-webtest.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-white pr-[12%] pl-[12%] pt-[6%] pb-[5%]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Web-only collage test</h1>
        <Link href="/board" className="text-sm text-[#FF6021] underline">Back to Board</Link>
      </div>

      <p className="text-neutral-600 text-sm md:text-base font-light mt-2">
        This page uses only stock images (Pexels / Unsplash) and <b>does not call OpenAI</b>.
      </p>

      <div className="mt-4 flex gap-4 items-end flex-wrap">
        <label className="text-sm">
          <span className="block mb-1">Images per category</span>
          <input
            type="number"
            min={1}
            max={6}
            value={webPerCategory}
            onChange={(e) => setWebPerCategory(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
            className="border rounded px-3 py-1"
          />
        </label>

        <label className="text-sm">
          <span className="block mb-1">Provider</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="border rounded px-3 py-1"
          >
            <option value="both">Both (default)</option>
            <option value="pexels">Pexels only</option>
            <option value="unsplash">Unsplash only</option>
          </select>
        </label>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-[#FF6021] hover:bg-[#FF4F87] text-white font-light py-2 px-5 rounded-3xl disabled:opacity-50"
        >
          {loading ? "Fetching…" : "Regenerate"}
        </button>

        {imgUrl && (
          <button
            onClick={handleDownload}
            className="bg-black text-white font-light py-2 px-5 rounded-3xl"
          >
            Download
          </button>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-5xl bg-[#EFEFEF] rounded-3xl p-4 flex items-center justify-center">
          {loading && <div className="w-full aspect-[3/2] rounded-2xl bg-[#E5E5E5] animate-pulse" />}

          {!loading && err && (
            <div className="p-6 text-center text-[#FF6021] font-light">
              {err}
            </div>
          )}

          {!loading && !err && imgUrl && (
            <img src={imgUrl} alt="vision-board-web" className="w-full h-auto rounded-2xl" />
          )}
        </div>
      </div>
    </div>
  );
}
