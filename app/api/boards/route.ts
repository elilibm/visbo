// app/api/boards/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth.config";

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

export async function GET() {
  try {
    const email = await requireUserEmail();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection<BoardDoc>("boards");

    // Exclude heavy image field from list to avoid memory issues
    const docs = await col
      .find({ userId: email }, { projection: { image: 0 } })
      .sort({ updatedAt: -1 })
      .limit(60)
      .toArray();

    const boards = docs.map((b: any) => ({ ...b, _id: b._id?.toString?.() ?? b._id }));
    return NextResponse.json({ boards });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/boards error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const email = await requireUserEmail();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

    const { title, labels, image, thumb } = body as {
      title?: string;
      labels?: string[];
      image?: string;
      thumb?: string;
    };
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const now = new Date();
    const doc: BoardDoc = {
      userId: email,
      title: (title ?? "Vision Board").slice(0, 140),
      labels: Array.isArray(labels) ? labels.map(String).slice(0, 24) : [],
      image,
      thumb,
      createdAt: now,
      updatedAt: now,
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection<BoardDoc>("boards");

    const res = await col.insertOne(doc);
    return NextResponse.json({ ok: true, id: res.insertedId.toString() });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/boards error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
