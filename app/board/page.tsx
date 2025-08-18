// app/board/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type GoalsMap = Record<string, string>;
type PlanItem = { category: string; web: number; ai: boolean };

export default function BoardPage() {
  const router = useRouter();

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Seeded from Step 2 (these are already typed)
  const cats = useMemo<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem("visbo:lastCategories") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);

  const goals = useMemo<GoalsMap>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(sessionStorage.getItem("visbo:lastGoals") || "{}") as GoalsMap;
    } catch {
      return {};
    }
  }, []);

  const prompt = useMemo<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("visbo:lastPrompt");
  }, []);

  useEffect(() => {
    const run = async () => {
      // Re-read but with explicit types + no shadowing of `cats`/`goals`
      const catsFromSS = JSON.parse(
        sessionStorage.getItem("visbo:lastCategories") || "[]"
      ) as string[];

      const goalsFromSS = JSON.parse(
        sessionStorage.getItem("visbo:lastGoals") || "{}"
      ) as GoalsMap;

      const promptFromSS = (sessionStorage.getItem("visbo:lastPrompt") ?? null) as string | null;

      if ((!promptFromSS || !promptFromSS.trim()) && (!catsFromSS || catsFromSS.length === 0)) {
        router.replace("/step-2");
        return;
      }

      setLoading(true);
      setErr(null);
      setImgUrl(null);

      try {
        if (catsFromSS && catsFromSS.length > 0) {
          // Each category: 1–2 web images; every other category gets 1 AI
          const plan: PlanItem[] = catsFromSS.map(
            (category: string, i: number): PlanItem => ({
              category,
              web: Math.random() < 0.5 ? 1 : 2,
              ai: i % 2 === 0,
            })
          );

          const res = await fetch("/api/generate-collage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              categories: catsFromSS,
              goals: goalsFromSS,
              boardWidth: 2400,
              boardHeight: 1700,
              plan,
              layout: "grid",
            }),
          });

          if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => "")}`);

          const { image, error } = (await res.json()) as { image?: string; error?: string };
          if (error || !image) throw new Error(error || "No image returned");
          setImgUrl(image);
        } else {
          // Fallback
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptFromSS, numImages: 1 }),
          });
          if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => "")}`);
          const { images, error } = (await res.json()) as { images?: string[]; error?: string };
          if (error || !images || images.length === 0) throw new Error(error || "No image");
          setImgUrl(images[0]);
        }
      } catch (e) {
        setErr((e as Error).message || "Failed to create board");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router]);

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = "vision-board-2025.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const showError = !loading && (!!err || !imgUrl);

  return (
    <div className="min-h-screen bg-white pr-[20%] pl-[20%] pt-[6%] pb-[5%]">
      <div className="flex flex-col items-center text-center">
        <svg
          width="27"
          height="27"
          viewBox="0 0 46 43"
          fill="#FF6021"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 mb-2"
        >
          <path d="M22.5 43L3.01443 21.25L41.9856 21.25L22.5 43Z" />
          <path d="M22.7681 12.1316C22.7681 10.5384 22.478 8.96089 21.9142 7.48902C21.3504 6.01715 20.524 4.67978 19.4823 3.55325C18.4406 2.42673 17.2038 1.53313 15.8427 0.923461C14.4817 0.313792 13.0228 0 11.5496 0 10.0764 0 8.61754 0.313792 7.25645 0.923461 5.89535 1.53313 4.65863 2.42673 3.61689 3.55326 2.57515 4.67978 1.7488 6.01715 1.18502 7.48902 0.621231 8.96089 0.331055 10.5384 0.331055 12.1316L11.5496 12.1316H22.7681Z" />
          <path d="M45.2056 12.1316C45.2056 10.5384 44.9155 8.96089 44.3517 7.48902 43.7879 6.01715 42.9615 4.67978 41.9198 3.55325 40.8781 2.42673 39.6413 1.53313 38.2802 0.923461 36.9192 0.313792 35.4603 0 33.9871 0 32.5139 0 31.055 0.313792 29.6939 0.923461 28.3329 1.53313 27.0961 2.42673 26.0544 3.55326 25.0127 4.67978 24.1863 6.01715 23.6225 7.48902 23.0587 8.96089 22.7686 10.5384 22.7686 12.1316L33.9871 12.1316H45.2056Z" />
          <rect x="0.331055" y="11.8495" width="44.8742" height="4.7962" />
        </svg>

        <h1 className="text-2xl md:text-3xl font-semibold">Your board is ready</h1>
        <p className="text-neutral-600 text-sm md:text-base font-light mt-2">
          Want to make tweaks to the generated board? Editing is coming soon
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-3xl bg-[#EFEFEF] rounded-3xl p-4 flex items-center justify-center">
          {loading && <div className="w-full aspect-[3/4] rounded-2xl bg-[#E5E5E5] animate-pulse" />}

          {showError && (
            <div className="p-6 text-center text-[#FF6021] font-light">
              Error generating board. Contact elili.sivam@gmail.com
            </div>
          )}

          {!loading && !showError && imgUrl && (
            <img src={imgUrl} alt="vision-board-2025" className="w-full h-auto rounded-2xl" />
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={!imgUrl || showError}
          className="bg-[#FF6021] hover:bg-[#FF4F87] text-white font-light py-2.5 px-6 rounded-3xl disabled:opacity-50"
        >
          Download
        </button>

        <Link href="/boards" className="bg-black text-white font-light py-2.5 px-6 rounded-3xl">
          All Boards
        </Link>
      </div>
    </div>
  );
}
