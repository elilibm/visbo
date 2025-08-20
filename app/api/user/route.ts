import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { auth } from "../../../auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json().catch(() => ({}));
  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const clean = username.trim();
  if (clean.length < 3 || clean.length > 32) {
    return NextResponse.json({ error: "Username must be 3–32 chars" }, { status: 400 });
  }

  const db = await getDb();

  // make username unique across users
  await db.collection("users").createIndex({ username: 1 }, { unique: true, sparse: true });

  // ensure no one else has this username
  const taken = await db.collection("users").findOne({ username: clean });
  if (taken && taken._id?.toString() !== session.user.id) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  await db
    .collection("users")
    .updateOne({ _id: session.user.id }, { $set: { username: clean } });

  return NextResponse.json({ ok: true });
}
