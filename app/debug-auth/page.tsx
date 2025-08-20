/*
# Mongo
MONGODB_URI=mongodb+srv://valavanmarakathalingasivam:<valavansivam>@cluster0.dkxmts2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=visbo

# NextAuth
AUTH_SECRET=uSCgfYprhpuIXQzt1fC2PmHpAqnpm CpHtEXV5e/nbxtvbA=
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Google OAuth
AUTH_GOOGLE_ID=61471778247-5asdff6bkdq1bt2dj1auo6v74cfkpbhg.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=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

# Resend
RESEND_API_KEY=re_4MEm3nuF_GxJ8aE8KuyJaEoonZpbZNJhb
RESEND_EMAIL_URL=https://resend.com/shared?token=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImVtYWlsX2lkIjoiYzQzNTZmNDMtMzBhNi00Y2U2LTg3MTAtNTU1YzcwNmI4MTJhIn0sImV4cCI6MTc1NTY3MDMzMH0.qfgLdbhhaXDikGAufWpRbjk2BZRWR6APw00566u22yI

*/

import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

async function getProviders() {
  const res = await fetch("http://localhost:3000/api/auth/providers", {
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, body: await res.text() };
}

export default async function DebugAuth() {
  const providers = await getProviders();

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontWeight: 700, fontSize: 20 }}>Auth Debug</h1>
      <p>AUTH_URL: {process.env.AUTH_URL}</p>
      <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
      <p>MONGODB_DB: {process.env.MONGODB_DB}</p>

      <h2 style={{ marginTop: 16, fontWeight: 600 }}>Providers endpoint</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f3f4f6", padding: 12 }}>
        {JSON.stringify(providers, null, 2)}
      </pre>

      <div style={{ marginTop: 16 }}>
        <Link href="/api/auth/signin" className="underline">
          Open /api/auth/signin
        </Link>
      </div>
    </main>
  );
}

