import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { auth } from "../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const db = await getDb();
  const user = await db
    .collection("users")
    .findOne({ _id: session.user.id }, { projection: { username: 1, name: 1, email: 1 } });

  return NextResponse.json({ user });
}
