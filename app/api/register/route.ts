import clientPromise from "@/lib/mongo";  // Adjust path if needed (your lib/mongo.ts)
import { NextResponse } from "next/server";
import { compare} from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const users = db.collection("users");

  const user = await users.findOne({ email: email.toLowerCase() });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await compare(password, user.passwordHash);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Authentication successful! Return user data (avoid sending passwordHash)
  // Convert _id to string for JSON serialization
  return NextResponse.json({
    ok: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
}