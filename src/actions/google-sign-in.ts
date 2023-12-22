"use server";

import * as auth from "@/auth";

export async function googleSignIn() {
  return auth.signIn("google");
}
