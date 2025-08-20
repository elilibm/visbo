"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}


