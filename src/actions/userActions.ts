"use server";

import paths from "@/utils/api-path";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

export type ISignUpRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

// ----------------------------------------------------------------------

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function signUp(body: ISignUpRequest) {
  try {
    const cookieId = cookies().get("next-auth.csrf-token")?.value as string;
    const { signUp } = paths();

    const res = await fetch(signUp(), {
      method: "POST",
      body: JSON.stringify({ ...body, cookieId }),
    }).then((res) => res.json());

    return res;
  } catch (error: any) {
    return JSON.parse(
      JSON.stringify(responseWrapper(500, null, error.message)),
    );
  }
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      const cookieId = cookies().get("next-auth.csrf-token")?.value as string;
      return { id: cookieId, role: "GUEST" };
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    return currentUser;
  } catch (error: any) {
    return null;
  }
}
