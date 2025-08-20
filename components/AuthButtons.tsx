// components/AuthButtons.tsx
"use client";

import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-5">
        {/* Sends user to /api/auth/signin and then to /home */}
        <button
          onClick={() => signIn(undefined, { callbackUrl: "/home" })}
          className="bg-[#FF6021] text-white font-light py-2 px-5 rounded-full shadow text-sm hover:brightness-110 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => signIn(undefined, { callbackUrl: "/home" })}
          className="text-[#BFF9FF] font-light underline text-sm"
        >
          Log In
        </button>
      </div>
    );
  }

  // Signed in
  return (
    <div className="flex items-center gap-5">
      <a
        href="/boards"
        className="bg-white/10 text-[#BFF9FF] font-light py-2 px-5 rounded-full text-sm underline"
      >
        Go to Boards
      </a>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-[#FF6021] text-white font-light py-2 px-5 rounded-full shadow text-sm hover:brightness-110 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
