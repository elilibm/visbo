// app/api/boards/[id]/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth.config";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireUserEmail() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("Unauthorized");
  return email;
}

// Single-argument handler; read [id] from the URL
export const GET = async (req) => {
  try {
    const email = await requireUserEmail();

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").filter(Boolean).pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection("boards");

    const doc = await col.findOne({ _id: new ObjectId(id), userId: email });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const board = { ...doc, _id: doc._id?.toString?.() ?? doc._id };
    return NextResponse.json({ board });
  } catch (err) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/boards/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
