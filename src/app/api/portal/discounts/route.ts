import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { discountValidationSchema } from "@/lib/validationSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = discountValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { conditionValue, description, pct, type, isActive } = body;

    const newDiscount = await prisma.discount.create({
      data: {
        description,
        conditionValue,
        pct,
        type,
        isActive,
      },
    });

    return responseWrapper(201, newDiscount, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
