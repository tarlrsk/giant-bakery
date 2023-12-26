import { prisma } from "@/lib/prisma";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "@/lib/validation-schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  const validatedEmail = emailValidationSchema.safeParse(email);
  const validatedPassword = passwordValidationSchema.safeParse(password);

  if (!validatedEmail.success || !validatedPassword.success) {
    return NextResponse.json(
      {
        error: { message: "Invalid email or password format" },
      },
      { status: 400 }
    );
  }

  try {
    const bcrypt = require("bcrypt");
    const saltRound = 10;

    const existedUser = await prisma.user.findUnique({
      where: { email: email },
    });

    // validate existed user.
    if (existedUser) {
      return NextResponse.json(
        { error: { message: "User with this email already exists." } },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Signed up successfully.", newUser },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
