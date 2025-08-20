import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic"; // do not prerender
export const runtime = "nodejs";        // ensure Node runtime

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return <div className="p-8">Private dashboard</div>;
}
