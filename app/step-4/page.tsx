// app/step-4/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ORANGE = "#FF6021";
const LIGHT_ORANGE_TILE = "#FFE7DE";
const LIGHT_GREY_TILE = "#F5F5F5";

export default function Step4CustomTextPage() {
  const router = useRouter();

  // Restore any prior phrases from sessionStorage
  const [phrases, setPhrases] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("visbo:descriptions") || "[]";
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        setPhrases(arr.map((s) => String(s)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist whenever phrases change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "visbo:descriptions",
        JSON.stringify(phrases.filter((p) => p.trim().length > 0))
      );
    } catch {}
  }, [phrases]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setCustomInput("");
  };

  const addCustom = () => {
    const text = customInput.trim();
    if (!text) return;
    setPhrases((prev) => {
      // de-dupe (case-insensitive)
      const exists = prev.some((p) => p.toLowerCase() === text.toLowerCase());
      return exists ? prev : [...prev, text];
    });
    closeModal();
  };

  const removePhrase = (text: string) => {
    setPhrases((prev) => prev.filter((p) => p !== text));
  };

  const continueToBoard = () => {
    // ensure saved
    try {
      sessionStorage.setItem(
        "visbo:descriptions",
        JSON.stringify(phrases.filter((p) => p.trim().length > 0))
      );
    } catch {}
    router.push("/board");
  };

  return (
    <div className="min-h-screen bg-white pr-[20%] pl-[20%] pt-[8%] pb-[5%]">
      {/* Header */}
      <div className="pb-[3%] pl-[1%]">
        <svg
          width="27"
          height="27"
          viewBox="0 0 46 43"
          fill={ORANGE}
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
        >
          <path d="M22.5 43L3.01443 21.25L41.9856 21.25L22.5 43Z" />
          <path d="M22.7681 12.1316C22.7681 10.5384 22.478 8.96089 21.9142 7.48902C21.3504 6.01715 20.524 4.67978 19.4823 3.55325C18.4406 2.42673 17.2038 1.53313 15.8427 0.923461C14.4817 0.313792 13.0228 0 11.5496 0 10.0764 0 8.61754 0.313792 7.25645 0.923461 5.89535 1.53313 4.65863 2.42673 3.61689 3.55326 2.57515 4.67978 1.7488 6.01715 1.18502 7.48902 0.621231 8.96089 0.331055 10.5384 0.331055 12.1316L11.5496 12.1316H22.7681Z" />
          <path d="M45.2056 12.1316C45.2056 10.5384 44.9155 8.96089 44.3517 7.48902 43.7879 6.01715 42.9615 4.67978 41.9198 3.55325 40.8781 2.42673 39.6413 1.53313 38.2802 0.923461 36.9192 0.313792 35.4603 0 33.9871 0 32.5139 0 31.055 0.313792 29.6939 0.923461 28.3329 1.53313 27.0961 2.42673 26.0544 3.55326 25.0127 4.67978 24.1863 6.01715 23.6225 7.48902 23.0587 8.96089 22.7686 10.5384 22.7686 12.1316L33.9871 12.1316H45.2056Z" />
          <rect x="0.331055" y="11.8495" width="44.8742" height="4.7962" />
        </svg>
      </div>

      <div className="dmsans text-4xl font-bold pl-[1%]">Custom Text</div>
      <p className="text-neutral-600 text-md font-light pt-[1%] pb-[4%] pl-[1%]">
        Add short phrases you want overlaid on your vision board (e.g. mantras,
        affirmations). Use the button to add each phrase as a separate item.
      </p>

      {/* Selected phrases as chips */}
      {phrases.length > 0 && (
        <div className="pl-[1%] mb-4 flex flex-wrap gap-2">
          {phrases.map((text) => (
            <span
              key={text}
              className="text-xs rounded-2xl px-3 py-1 flex items-center gap-2"
              style={{ backgroundColor: LIGHT_ORANGE_TILE, color: ORANGE }}
            >
              {text}
              <button
                onClick={() => removePhrase(text)}
                className="ml-1 rounded-full w-4 h-4 flex items-center justify-center bg-white text-black text-[10px] leading-none"
                aria-label={`Remove ${text}`}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Bottom buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={openModal}
          className="rounded-3xl px-6 py-3 font-light text-white bg-black"
        >
          Add
        </button>
        <button
          onClick={continueToBoard}
          disabled={phrases.length === 0}
          className="hover:bg-[#FF4F87] text-white font-light py-3 px-6 rounded-3xl disabled:opacity-50"
          style={{ backgroundColor: ORANGE }}
        >
          Next →
        </button>
      </div>

      {/* Modal (reused pattern from Step 1) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl p-6 bg-white">
            <div className="text-xl font-light mb-3">Add custom text</div>
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. nothing is impossible"
              className="w-full border rounded-2xl px-3 py-2 text-sm font-light focus:outline-none focus:ring-0"
            />
            <div className="mt-5 flex items-center justify-end">
              <button
                onClick={addCustom}
                className="rounded-2xl px-5 py-2 text-white text-sm"
                style={{ backgroundColor: "#000000" }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
