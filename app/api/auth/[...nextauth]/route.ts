// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongo";

const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: process.env.MONGODB_DB }),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  // you can also use NEXTAUTH_SECRET
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export const runtime = "nodejs";
export { handler as GET, handler as POST };
