"use client";

import { useState } from "react";

const categories: string[] = [
  "personal growth",
  "health and fitness",
  "career and ambition",
  "wealth",
  "meaning and spirituality",
  "relationships",
  "environment and lifestyle",
  "travel",
  "hobbies",
  "legacy and contribution",
];

export default function Page() {
  const [goals, setGoals] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleChange = (category: string, value: string) => {
    setGoals((prev) => ({ ...prev, [category]: value }));

    const charCount = value.trim().length;

    if (charCount === 0) {
      setStatus((prev) => ({ ...prev, [category]: "blank" }));
    } else if (charCount >= 100 && charCount <= 1500) {
      setStatus((prev) => ({ ...prev, [category]: "valid" }));
    } else {
      setStatus((prev) => ({ ...prev, [category]: "invalid" }));
    }
  };

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case "valid":
        return "border-green-500 bg-green-50";
      case "invalid":
        return "border-red-500 bg-red-50";
      case "blank":
        return "border-gray-300 bg-white";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    setImageUrl(null);
    const res = await fetch("/api/chat", { method: "POST" });
    const data = await res.json(); // ✅ Will now work
    setImageUrl(data.imageUrl);
  };
 /* const handleSubmit = async () => {
    setLoading(true);

  const filteredGoals = Object.entries(goals).filter(([_, val]) => val.trim().length > 0);
  const prompt = filteredGoals
  .map(([category, goal]) => `${category.toUpperCase()}: ${goal}`)
  .join("\n\n");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  setResponse(data.imageUrl);
  setLoading(false);
  }; */

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Vision Board 2025 - Input Your Goals
      </h1>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Category</th>
            <th className="p-4">Your Goal</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: string) => (
            <tr key={category}>
              <td className="p-4 align-top font-medium capitalize">
                {category}
              </td>
              <td className="p-4">
                <textarea
                  placeholder={`Enter your goal for ${category}`}
                  value={goals[category] || ""}
                  onChange={(e) => handleChange(category, e.target.value)}
                  className={`w-full min-h-[60px] resize-none rounded-md border p-2 ${getStatusStyle(
                    status[category]
                  )}`}
                />
                {status[category] === "invalid" && (
                  <p className="text-sm text-red-500 mt-1">Be more descriptive.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center">
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
      >Generate Image
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Image"
          className="mt-6 mx-auto rounded shadow-md max-w-md"
        />
      )}
    </div>

    </div>
  );
}
