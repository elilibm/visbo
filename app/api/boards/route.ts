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

// ✅ Only one parameter (Request). No context/params argument at all.
export const GET = async (req: Request): Promise<Response> => {
  try {
    const email = await requireUserEmail();

    // Extract `[id]` from the path: e.g. /api/boards/66d0e8... -> "66d0e8..."
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").filter(Boolean).pop();

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
};
