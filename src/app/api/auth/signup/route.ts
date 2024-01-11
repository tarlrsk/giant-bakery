import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { customerSignUpValidationSchema } from "@/lib/validation-schema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword, phone } = await req.json();

    if (!name?.trim()) {
      return responseWrapper(400, null, "Name is required.");
    }

    if (!email?.trim()) {
      return responseWrapper(400, null, "Email is required.");
    }

    if (!password?.trim()) {
      return responseWrapper(400, null, "Password is required.");
    }

    const validation = customerSignUpValidationSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      return responseWrapper(
        400,
        validation.error.format(),
        "Invalid email or password",
      );
    }

    if (password !== confirmPassword) {
      return responseWrapper(400, null, "Password unmatched.");
    }

    const bcrypt = require("bcrypt");
    const saltRound = 10;

    const existedUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existedUser) {
      return responseWrapper(409, null, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        phone: phone,
      },
    });

    return responseWrapper(201, newUser, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
