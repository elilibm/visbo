// app/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() { 
  const session = await auth();
  if (!session) redirect("/login");
  return <div className="p-8">Private dashboard</div>;
}