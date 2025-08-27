// app/boards/page.tsx
"use client";

import { useEffect, useState } from "react";

type Board = {
  _id: string;
  title: string;
  labels: string[];
  thumb?: string;
  createdAt: string;
  updatedAt: string;
};

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalErr, setModalErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch("/api/boards", { cache: "no-store" });
        const txt = await res.text();
        if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
        const data = JSON.parse(txt);
        setBoards(
          (data.boards ?? []).map((b: any) => ({
            ...b,
            _id: b._id?.$oid ?? b._id,
          }))
        );
      } catch (e: any) {
        setErr(e.message || "Failed to load boards");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  async function openModal(boardId: string, title: string) {
    setSelectedId(boardId);
    setSelectedTitle(title);
    setSelectedImage(null);
    setModalErr(null);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/boards/${boardId}`, { cache: "no-store" });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
      const doc = JSON.parse(txt);
      setSelectedImage(doc.image as string);
    } catch (e: any) {
      setModalErr(e.message || "Failed to load board");
    } finally {
      setModalLoading(false);
    }
  }

  function closeModal() {
    setSelectedId(null);
    setSelectedTitle("");
    setSelectedImage(null);
    setModalErr(null);
    setModalLoading(false);
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-12 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">All Boards</h1>
        <p className="text-neutral-600 text-sm md:text-base font-light">
          Where past, present and future meet.
        </p>
      </header>

      {/* Search + Generate row (visual only) */}
      <div className="flex gap-3 max-w-2xl mb-6">
        <div className="flex-1 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
          Search Boards
        </div>
        <a href="/step-2" className="bg-[#FF6021] text-white rounded-full px-4 py-2 text-sm">
          Generate
        </a>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-neutral-100 rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      ) : err ? (
        <div className="text-[#FF6021]">{err}</div>
      ) : boards.length === 0 ? (
        <div className="text-neutral-600">No boards yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((b) => (
            <button
              key={b._id}
              onClick={() => openModal(b._id, b.title || "Vision Board")}
              className="text-left bg-neutral-100 rounded-2xl p-3 hover:shadow transition cursor-pointer"
            >
              <div className="h-40 w-full bg-neutral-200 rounded-xl overflow-hidden">
                {b.thumb ? (
                  <img
                    src={b.thumb}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-300" />
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-medium truncate">{b.title || "Vision Board"}</div>
                <div className="text-xs text-neutral-500">
                  edited{" "}
                  {new Date(b.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-4 w-full max-w-3xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200"
              onClick={closeModal}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="mb-3 text-lg font-semibold truncate">{selectedTitle}</div>

            {modalLoading && (
              <div className="w-full aspect-[3/2] rounded-xl bg-neutral-200 animate-pulse" />
            )}
            {modalErr && <div className="text-[#FF6021]">{modalErr}</div>}
            {!modalLoading && !modalErr && selectedImage && (
              <img
                src={selectedImage}
                alt={selectedTitle}
                className="w-full h-auto rounded-xl"
                loading="eager"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
