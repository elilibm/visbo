// app/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() { 
  const session = await auth();
  if (!session) redirect("/login");
  return <div className="p-8">Private dashboard</div>;
}