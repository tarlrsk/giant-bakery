import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  // TODO create page
  // pages: {
  //   signIn: "/",
  // },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "John Doe" },
        email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" },
        confirmPassword: { label: "Password Confirmation", type: "password" },
      },
      async authorize(credentials, req) {
        const bcrypt = require("bcrypt");

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) return null;

        // const confirmedPassword =
        //   credentials?.password === credentials?.confirmPassword;

        // if (!confirmedPassword) {
        //   throw new Error("Password does not match");
        // }

        const isValidPassword = await bcrypt.compare(
          credentials?.password || "",
          user?.hashedPassword,
        );

        if (!isValidPassword) return null;

        return user;
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
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    // fixing a bug in next-auth to assign id to user after signed in.
    async session({ session, user, token }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      session.user.id = token.id;

      return session;
    },

    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        token.id = user.id;
      }

      return token;
    },
  },
};
