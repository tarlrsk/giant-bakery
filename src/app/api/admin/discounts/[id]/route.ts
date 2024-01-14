import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isObjectId } from "@/lib/objectId";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { discountValidationSchema } from "@/lib/validationSchema";

type GetDiscountById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetDiscountById) {
  try {
    const { id } = params;

    const validId = isObjectId(id);

    if (!validId) {
      return responseWrapper(400, null, "Invalid Object Id");
    }

    const discount = await prisma.discount.findUnique({
      where: { id: id },
    });

    if (!discount) {
      return responseWrapper(
        404,
        null,
        `Discount with given id ${id} not found.`,
      );
    }

    return responseWrapper(200, discount, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetDiscountById) {
  try {
    const { id } = params;

    const validId = isObjectId(id);

    if (!validId) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }

    const body = await req.json();

    const validation = discountValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    const discount = await prisma.discount.findUnique({
      where: { id: id },
    });

    if (!discount) {
      return responseWrapper(
        404,
        null,
        `Discount with given id ${id} not found.`,
      );
    }

    const updatedDiscount = await prisma.discount.update({
      where: { id: discount.id },
      data: body,
    });

    return responseWrapper(200, updatedDiscount, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: GetDiscountById) {
  try {
    const { id } = params;

    const validId = isObjectId(id);

    if (!validId) {
      return responseWrapper(400, null, "Invalid Object Id");
    }

    const discount = await prisma.discount.findUnique({
      where: { id: id },
    });

    if (!discount) {
      return responseWrapper(
        404,
        null,
        `Discount with given id ${id} not found.`,
      );
    }

    await prisma.discount.delete({
      where: { id: id },
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
