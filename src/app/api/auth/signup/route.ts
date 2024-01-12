import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { customerSignUpValidationSchema } from "@/lib/validation-schema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, phone } = await req.json();

    if (!email?.trim()) {
      return responseWrapper(400, null, "กรุณาใส่อีเมล");
    }

    if (!password?.trim()) {
      return responseWrapper(400, null, "กรุณาใส่รหัสผ่าน");
    }

    const validation = customerSignUpValidationSchema.safeParse({
      email,
      password,
      confirmPassword,
      phone,
    });

    if (!validation.success) {
      return responseWrapper(
        400,
        validation.error.format(),
        "Invalid email or password",
      );
    }

    if (password !== confirmPassword) {
      return responseWrapper(400, null, "พาสเวิร์ดไม่เหมือนกัน");
    }

    const bcrypt = require("bcrypt");
    const saltRound = 10;

    const existedUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existedUser) {
      return responseWrapper(409, null, "อีเมลนี้ถูกใช้งานแล้ว");
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
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
