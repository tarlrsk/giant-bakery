import { prisma } from "@/lib/prisma";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // TODO: Consider these lines to be in try catch block to avoid unexpected errors
  const { name, email, password } = await req.json();

  const validatedEmail = emailValidationSchema.safeParse(email);
  const validatedPassword = passwordValidationSchema.safeParse(password);

  if (!validatedEmail.success || !validatedPassword.success) {
    return responseWrapper(400, null, "Invalid email or password format.");
  }

  try {
    const bcrypt = require("bcrypt");
    const saltRound = 10;

    const existedUser = await prisma.user.findUnique({
      where: { email: email },
    });

    // validate existed user.
    if (existedUser) {
      return responseWrapper(409, null, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    return responseWrapper(201, newUser, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong.\n Error: ${err.message}`,
    );
  }
}
