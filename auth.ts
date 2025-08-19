// auth.ts (project root)
import useSWR from 'swr'
import clientPromise from "@/lib/mongo";
import NextAuth, { AuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";

export const authConfig: AuthConfig = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: process.env.MONGODB_DB }),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!isValid) return null;

        return { id: user._id.toString(), name: user.name ?? null, email: user.email, image: null };
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// App Router handlers + helpers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);