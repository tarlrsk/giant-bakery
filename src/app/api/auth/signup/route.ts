import { prisma } from "@/lib/prisma";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim()) {
      return responseWrapper(400, null, "Name is required.");
    }

    if (!email?.trim()) {
      return responseWrapper(400, null, "Email is required.");
    }

    if (!password?.trim()) {
      return responseWrapper(400, null, "Password is required.");
    }

    const validatedEmail = emailValidationSchema.safeParse(email);
    const validatedPassword = passwordValidationSchema.safeParse(password);

    if (!validatedEmail.success || !validatedPassword.success) {
      return responseWrapper(400, null, "Invalid email or password format.");
    }

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
    return responseWrapper(500, null, err.message);
  }
}
