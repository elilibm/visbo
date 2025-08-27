// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../api/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div className="p-8">Private dashboard</div>;
}
