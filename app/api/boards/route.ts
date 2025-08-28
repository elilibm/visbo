// app/api/boards/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth.config";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BoardDoc = {
  _id?: any;
  userId: string;   // email
  title: string;
  labels: string[];
  image: string;    // full-size data URL or URL
  thumb?: string;   // small image for grid
  createdAt: Date;
  updatedAt: Date;
};

async function requireUserEmail() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("Unauthorized");
  return email;
}

// ✅ Only one argument (Request). Read id from URL to dodge the signature checker.
export async function GET(req: Request) {
  try {
    const email = await requireUserEmail();

    // Extract the [id] from the URL path
    const { pathname } = new URL(req.url);
    // e.g. /api/boards/66cfd1e5f0f2a9a0b2e9f111
    const segments = pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection<BoardDoc>("boards");

    const doc = await col.findOne({ _id: new ObjectId(id), userId: email });
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      board: { ...doc, _id: doc._id?.toString?.() ?? doc._id },
    });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/boards/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
