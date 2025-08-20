import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongo"; // adjust if your path differs

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: process.env.MONGODB_DB }),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      // keep these names if that is what you already set in Vercel
      clientId: process.env.AUTH_GOOGLE_ID!,       // or GOOGLE_CLIENT_ID
      clientSecret: process.env.AUTH_GOOGLE_SECRET!, // or GOOGLE_CLIENT_SECRET
    }),
  ],
  secret: process.env.AUTH_SECRET, // or use NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export const runtime = "nodejs";
export { handler as GET, handler as POST }; // for App Router API route
