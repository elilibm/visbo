"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserInfoPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="p-8">Loading...</main>;
  }

  return (
    <main className="p-8">
      {!session ? (
        <Link className="underline" href="/login">Login</Link>
      ) : (
        <div className="space-y-2">
          <div>Hello {session.user?.name ?? session.user?.email}</div>
          <button
            className="border p-2 rounded"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </button>
        </div>
      )}
    </main>
  );
}
