import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { cakeValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  try {
    const cakes = await prisma.cake.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        variants: true,
      },
    });

    return responseWrapper(200, cakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}.`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { variantIds } = body;

    for (var variantId of variantIds) {
      let variant = await prisma.variant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return responseWrapper(
          404,
          null,
          `Variant with given id ${variantId} not found.`,
        );
      }
    }

    const newCake = await prisma.cake.create({
      data: body,
    });

    return responseWrapper(201, newCake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
