import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { validate as isValidUUID } from "uuid";
import { cakeValidationSchema } from "@/lib/validationSchema";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

type GetCakeByIdProps = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const cake = await prisma.cake.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        variants: true,
        unitType: true,
      },
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }
    return responseWrapper(200, cake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }
    const body = await req.json();

    const cake = await prisma.cake.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        variants: true,
        unitType: true,
      },
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }

    const validation = cakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const updatedCake = await prisma.cake.update({
      where: {
        id: cake.id,
      },
      data: body,
      include: {
        variants: true,
        unitType: true,
      },
    });

    return responseWrapper(200, updatedCake, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong. \n Error: ${err.message}`,
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }

    const cake = await prisma.cake.findUnique({
      where: { id: id, isDeleted: false },
      include: {
        variants: true,
        unitType: true,
      },
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }

    await prisma.cake.update({
      where: { id: cake.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now()),
      },
      include: {
        variants: true,
        unitType: true,
      },
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
