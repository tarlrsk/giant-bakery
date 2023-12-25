import { Adapter } from "next-auth/adapters";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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
      id: "admin-signin",
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    Credentials({
      id: "customer-signin",
      name: "Customer",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
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
