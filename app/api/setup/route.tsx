import { getServerSession } from "next-auth";
import { authConfig } from "../../../auth";
import clientPromise from "../../../lib/mongo";

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { username } = await req.json();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: { username } }
  );

  return new Response("OK", { status: 200 });
}
