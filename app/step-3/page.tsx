// app/step-3/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step3TitlePage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("visbo:title") || ""
      : ""
  );
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    try {
      const clean = title.trim() || "Vision Board 2025";
      sessionStorage.setItem("visbo:title", clean);
      router.push("/step-4");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <h1 className="dmsans text-3xl md:text-4xl font-bold pl-[1%]">Custom Title</h1>
      <p className="text-neutral-600 text-sm md:text-base font-light pt-[1%] pb-[4%] pl-[1%]">
        What would you like the title of your vision board to be? Enter below.
        <br /> Tips: Add a year or date range and your name.
      </p>

      <div className="w-full">
        <input
          type="text"
          placeholder="enter your custom title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl bg-[#F0F0F0] px-4 py-4 text-sm md:text-base outline-none"
        />
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleNext}
          disabled={loading}
          className="hover:bg-[#FF4F87] bg-[#FF6021] text-white font-light py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          {loading ? "Saving…" : "Next →"}
        </button>
      </div>
    </div>
  );
}
