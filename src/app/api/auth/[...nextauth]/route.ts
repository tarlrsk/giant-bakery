import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../../prisma/client";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!FACEBOOK_CLIENT_ID || !FACEBOOK_CLIENT_SECRET) {
  throw new Error("Missing Facebook oauth credentials");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google oauth credentials");
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // fixing a bug in next-auth to assign id to user after login.
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
