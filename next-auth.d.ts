import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
