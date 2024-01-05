import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

type GetVariantById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    const variant = await prisma.variant.findUnique({
      where: { id: id },
    });

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}

export async function PUT(req: NextRequest, { params }: GetVariantById) {}

export async function DELETE(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    const variant = await prisma.variant.findUnique({
      where: { id: id },
    });

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    await prisma.variant.delete({ where: { id: id } });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}
