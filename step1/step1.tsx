"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const predefinedCategories = [
  "career and ambition",
  "meaning and spirituality",
  "personal growth",
  "relationships",
  "health and fitness",
  "travel",
  "wealth",
  "hobbies",
];

export default function Step1() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (cat: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cat)) {
        newSet.delete(cat);
      } else {
        newSet.add(cat);
      }
      return newSet;
    });
  };

  const addCustom = () => {
    setCustomCategories((prev) => [...prev, ""]);
  };

  const updateCustom = (index: number, value: string) => {
    const newCustom = [...customCategories];
    newCustom[index] = value;
    setCustomCategories(newCustom);
  };

  const handleNext = () => {
    const selectedPredefined = Array.from(selected);
    const selectedCustom = customCategories.filter((cat) => cat.trim() !== "");
    const allSelected = [...selectedPredefined, ...selectedCustom];
    if (allSelected.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    const query = allSelected.map(encodeURIComponent).join(",");
    router.push(`/vision-board?categories=${query}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-10 px-4">
      <Image
        src="/img/logo.svg"
        alt="Visbo Logo"
        width={50}
        height={44}
        className="mb-6 transform rotate-180"
      />
      <h1 className="text-4xl font-bold text-black mb-2">Select all that apply.</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-xl">
        Choose all the categories you want to focus on for this vision board. Select all that apply.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-10">
        {predefinedCategories.map((cat) => (
          <div
            key={cat}
            onClick={() => toggleSelect(cat)}
            className={`bg-gray-100 rounded-xl p-4 cursor-pointer text-gray-700 ${
              selected.has(cat) ? "bg-orange-100 border-2 border-orange-500" : ""
            }`}
          >
            {cat}
          </div>
        ))}
        {customCategories.map((cat, index) => (
          <div key={`custom-${index}`} className="bg-gray-100 rounded-xl p-4">
            <input
              type="text"
              value={cat}
              onChange={(e) => updateCustom(index, e.target.value)}
              placeholder="enter category name"
              className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        ))}
      </div>
      <div className="w-full max-w-2xl flex justify-between mb-10">
        <button
          onClick={addCustom}
          className="bg-black text-white font-medium py-3 px-6 rounded-full hover:bg-gray-800 transition"
        >
          + Add
        </button>
        <button
          onClick={handleNext}
          className="bg-orange-500 text-white font-medium py-3 px-8 rounded-full hover:bg-orange-600 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}