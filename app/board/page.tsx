// app/board/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type GoalsMap = Record<string, string>;
type PlanItem = { category: string; web: number; ai: boolean };
type Badge = { text: string; leftPct: number; topPct: number; isTitle?: boolean };

const TITLE_FONT_FRAC_OF_WIDTH = 0.046;
const LABEL_FONT_FRAC_OF_WIDTH = 0.020;
const FONT_FAMILY =
  "'DM Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial";

export default function BoardPage() {
  const router = useRouter();

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [boardTitle, setBoardTitle] = useState("Vision Board 2025");
  const [boardLabels, setBoardLabels] = useState<string[]>([
    "rich era",
    "meta SWE",
    "queen",
    "nothing is impossible",
  ]);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem("visbo:title");
      if (t && t.trim()) setBoardTitle(t.trim());
    } catch {}
    try {
      const raw = sessionStorage.getItem("visbo:descriptions");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const cleaned = arr.map(String).filter(Boolean);
          if (cleaned.length) setBoardLabels(cleaned);
        }
      }
    } catch {}
  }, []);

  // fetch collage
  useEffect(() => {
    const run = async () => {
      const cats = JSON.parse(sessionStorage.getItem("visbo:lastCategories") || "[]") as string[];
      const goals = JSON.parse(sessionStorage.getItem("visbo:lastGoals") || "{}") as GoalsMap;
      const prompt = (sessionStorage.getItem("visbo:lastPrompt") ?? null) as string | null;

      if ((!prompt || !prompt.trim()) && (!cats || cats.length === 0)) {
        router.replace("/step-2");
        return;
      }

      setLoading(true);
      setErr(null);
      setImgUrl(null);

      try {
        if (cats && cats.length > 0) {
          const plan: PlanItem[] = cats.map((category: string, i: number) => ({
            category,
            web: Math.random() < 0.5 ? 1 : 2,
            ai: i % 2 === 0,
          }));

          const res = await fetch("/api/generate-collage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              categories: cats,
              goals,
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
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, numImages: 1 }),
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

  /* -------------------- overlay badges -------------------- */
  const [badges, setBadges] = useState<Badge[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [dispW, setDispW] = useState(0);
  const [dispH, setDispH] = useState(0);

  useEffect(() => {
    const capture = () => {
      const w = imgRef.current?.clientWidth || 0;
      const h = imgRef.current?.clientHeight || 0;
      if (w) setDispW(w);
      if (h) setDispH(h);
    };
    capture();
    const onResize = () => capture();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!imgUrl) return;

    const n = boardLabels.length;
    const placed: Badge[] = [{ text: boardTitle, leftPct: 50, topPct: 50, isTitle: true }];

    if (n > 0) {
      const firstCount = Math.min(n, 8);
      const secondCount = Math.max(0, n - firstCount);

      const placeRing = (count: number, radiusPct: number, angleOffset: number) => {
        for (let i = 0; i < count; i++) {
          const a = angleOffset + (i * 2 * Math.PI) / Math.max(count, 1);
          const dx = radiusPct * Math.cos(a);
          const dy = radiusPct * Math.sin(a);
          let x = 50 + dx;
          let y = 50 + dy;
          x = Math.max(6, Math.min(94, x));
          y = Math.max(8, Math.min(92, y));
          placed.push({
            text: boardLabels[placed.length - 1],
            leftPct: x,
            topPct: y,
          });
        }
      };

      placeRing(firstCount, 30, (boardTitle.length % 360) * (Math.PI / 180));
      if (secondCount > 0) {
        placeRing(secondCount, 40, ((boardTitle.length * 7) % 360) * (Math.PI / 180) + Math.PI / 10);
      }
    }

    setBadges(placed);
  }, [imgUrl, boardLabels, boardTitle]);

  /* ------------------------ download ----------------------- */
  const sanitizeFilename = (s: string) =>
    (s.trim().replace(/[^\w\d-_ ]+/g, "").replace(/\s+/g, "-").slice(0, 80) || "vision-board");

  async function handleDownload() {
    if (!imgUrl) return;

    const base = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imgUrl!;
    });

    const W = base.naturalWidth || base.width;
    const H = base.naturalHeight || base.height;

    const titleFontPx = Math.max(26, Math.round(W * TITLE_FONT_FRAC_OF_WIDTH));
    const labelFontPx = Math.max(14, Math.round(W * LABEL_FONT_FRAC_OF_WIDTH));
    const titlePadX = Math.round(titleFontPx * 0.8);
    const titlePadY = Math.round(titleFontPx * 0.4);
    const labelPadX = Math.round(labelFontPx * 0.75);
    const labelPadY = Math.round(labelFontPx * 0.38);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(base, 0, 0, W, H);

    const ORANGE = "#FF6021";
    const WHITE = "#FFFFFF";

    const wrapLines = (
      text: string,
      fontPx: number,
      maxWidth: number,
      weight: "700" | "300"
    ) => {
      ctx.font = `${weight} ${fontPx}px ${FONT_FAMILY}`;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const next = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(next).width <= maxWidth || !cur) cur = next;
        else {
          lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    function drawRect(x: number, y: number, w: number, h: number) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.closePath();
    }

    function drawBadge(cx: number, cy: number, text: string, isTitle: boolean) {
      const fontPx = isTitle ? titleFontPx : labelFontPx;
      const padX = isTitle ? titlePadX : labelPadX;
      const padY = isTitle ? titlePadY : labelPadY;
      const weight: "700" | "300" = isTitle ? "700" : "300";

      const maxBlock = (isTitle ? 0.48 : 0.34) * W;
      const lineGap = Math.round(fontPx * 0.18);
      const lines = wrapLines(text, fontPx, maxBlock - padX * 2, weight);

      ctx.font = `${weight} ${fontPx}px ${FONT_FAMILY}`;
      let maxW = 0;
      for (const ln of lines) maxW = Math.max(maxW, ctx.measureText(ln).width);
      const textH = lines.length * fontPx + (lines.length - 1) * lineGap;

      const boxW = Math.ceil(maxW + padX * 2);
      const boxH = Math.ceil(textH + padY * 2);
      const x = Math.round(cx - boxW / 2);
      const y = Math.round(cy - boxH / 2);

      ctx.save();
      ctx.fillStyle = ORANGE;
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = Math.round(fontPx * 0.25);
      ctx.shadowOffsetY = Math.round(fontPx * 0.08);
      drawRect(x, y, boxW, boxH);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = WHITE;
      ctx.textBaseline = "top";
      ctx.font = `${weight} ${fontPx}px ${FONT_FAMILY}`;
      let yCur = y + padY + (boxH - (textH + padY * 2)) / 2;
      for (const ln of lines) {
        const w = ctx.measureText(ln).width;
        ctx.fillText(ln, x + (boxW - w) / 2, yCur);
        yCur += fontPx + lineGap;
      }
    }

    const all: Badge[] = [
      { text: boardTitle, leftPct: 50, topPct: 50, isTitle: true },
      ...badges.filter((b) => !b.isTitle),
    ];
    for (const b of all) {
      drawBadge((b.leftPct / 100) * W, (b.topPct / 100) * H, b.text, !!b.isTitle);
    }

    const a = document.createElement("a");
    a.href = (document.querySelector("canvas") as HTMLCanvasElement)?.toDataURL?.("image/png") ?? "";
    a.download = `${sanitizeFilename(boardTitle)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Make a ~480px-wide thumbnail to store alongside the full image
  async function buildThumbnail(fullUrl: string): Promise<string> {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = fullUrl;
    });

    const maxW = 480;
    const scale = Math.min(1, maxW / (img.naturalWidth || img.width || maxW));
    const W = Math.round((img.naturalWidth || img.width) * scale);
    const H = Math.round((img.naturalHeight || img.height) * scale);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, W, H);

    return canvas.toDataURL("image/jpeg", 0.7);
  }

  async function handleSave() {
    if (!imgUrl || saving) return;
    setSaving(true);
    try {
      const thumb = await buildThumbnail(imgUrl);
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: boardTitle,
          labels: boardLabels,
          image: imgUrl,
          thumb,
        }),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
      window.location.href = "/boards";
    } catch (e: any) {
      alert(`Save failed: ${e?.message ?? e}`);
    } finally {
      setSaving(false);
    }
  }

  const showError = !loading && (!!err || !imgUrl);

  return (
    <div className="min-h-screen bg-white pr-[20%] pl-[20%] pt-[6%] pb-[5%]">
      <div className="flex flex-col items-center text-center">
        <svg width="27" height="27" viewBox="0 0 46 43" fill="#FF6021" className="w-10 h-10 mb-2">
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
        <div className="relative w-full max-w-3xl bg-[#EFEFEF] rounded-3xl p-4 flex items-center justify-center">
          {loading && <div className="w-full aspect-[3/4] rounded-2xl bg-[#E5E5E5] animate-pulse" />}

          {!loading && showError && (
            <div className="p-6 text-center text-[#FF6021] font-light">
              Error generating board. Contact elili.sivam@gmail.com
            </div>
          )}

          {!loading && !showError && imgUrl && (
            <>
              <img
                ref={imgRef}
                src={imgUrl}
                alt="vision-board-2025"
                className="w-full h-auto rounded-2xl"
                onLoad={() =>
                  requestAnimationFrame(() => {
                    setDispW(imgRef.current?.clientWidth || 0);
                    setDispH(imgRef.current?.clientHeight || 0);
                  })
                }
              />

              {/* Orange overlays */}
              <div className="pointer-events-none absolute inset-4">
                {badges.map((b, idx) => {
                  const isTitle = !!b.isTitle;
                  const fontSize = isTitle
                    ? Math.max(18, Math.round(dispW * TITLE_FONT_FRAC_OF_WIDTH))
                    : Math.max(12, Math.round(dispW * LABEL_FONT_FRAC_OF_WIDTH));
                  const padX = isTitle ? Math.round(fontSize * 0.8) : Math.round(fontSize * 0.75);
                  const padY = isTitle ? Math.round(fontSize * 0.4) : Math.round(fontSize * 0.38);
                  const maxW = Math.max(120, dispW * (isTitle ? 0.48 : 0.34));

                  return (
                    <span
                      key={`${b.text}-${idx}`}
                      className="absolute inline-block bg-[#FF6021] text-white"
                      style={{
                        left: `${b.leftPct}%`,
                        top: `${b.topPct}%`,
                        transform: "translate(-50%, -50%)",
                        padding: `${padY}px ${padX}px`,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.18,
                        fontFamily: FONT_FAMILY,
                        fontWeight: isTitle ? 700 : 300,
                        borderRadius: 0,
                        maxWidth: `${maxW}px`,
                        whiteSpace: "normal",
                        textAlign: "center",
                        boxShadow: `0 ${Math.round(fontSize * 0.1)}px ${Math.round(
                          fontSize * 0.35
                        )}px rgba(0,0,0,0.18)`,
                      }}
                    >
                      {b.text}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={!imgUrl || showError}
          className="bg-[#FF6021] hover:bg-[#FF4F87] text-white font-light py-2.5 px-6 rounded-3xl disabled:opacity-50 cursor-pointer"
        >
          Download
        </button>

        <button
          onClick={handleSave}
          disabled={!imgUrl || saving}
          className="bg-neutral-900 hover:bg-black text-white font-light py-2.5 px-6 rounded-3xl disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <Link href="/boards" className="bg-black text-white font-light py-2.5 px-6 rounded-3xl">
          All Boards
        </Link>
      </div>
    </div>
  );
}
