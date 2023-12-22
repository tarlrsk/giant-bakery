"use server";

import * as auth from "@/auth";

export async function facebookSignIn() {
  return auth.signIn("facebook");
}
