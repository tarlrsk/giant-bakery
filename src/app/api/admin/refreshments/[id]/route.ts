import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

type GetRefreshmentById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetRefreshmentById) {
  try {
    const { id } = params;

    const refreshment = await prisma.refreshment.findUnique({
      where: { id: id },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${id} not found.`,
      );
    }

    return responseWrapper(200, refreshment, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}

export async function PUT(req: NextRequest, { params }: GetRefreshmentById) {}

export async function DELETE(
  _req: NextRequest,
  { params }: GetRefreshmentById,
) {
  try {
    const { id } = params;

    const refreshment = await prisma.refreshment.findUnique({
      where: { id: id },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${id} not found.`,
      );
    }

    await prisma.refreshment.delete({ where: { id: id } });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}
