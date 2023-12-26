import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

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

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/",
  // },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },

      // TODO authorization
      async authorize(credentials, req) {
        throw new Error("Not implemented");
      },
    }),
    Facebook({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    // fixing a bug in next-auth to assign id to user after signed in.
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};
