// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "../../../auth.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Create the handler and export it as GET/POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
