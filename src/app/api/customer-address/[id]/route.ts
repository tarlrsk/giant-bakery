import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

type GetAddressByIdProps = {
  params: {
    id: string;
  };
};

export async function PUT(req: NextRequest, { params }: GetAddressByIdProps) {
  try {
    const { id } = params;
    const body = await req.json();

    const address = await prisma.customerAddress.findUnique({
      where: { id: id },
    });

    if (!address) {
      return responseWrapper(
        404,
        null,
        `Addresss with given id ${params.id} not found.`,
      );
    }

    const updatedAddress = await prisma.customerAddress.update({
      where: { id: address.id },
      data: body,
    });

    return responseWrapper(200, updatedAddress, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}

export async function DELETE({ params }: GetAddressByIdProps) {
  try {
    const { id } = params;

    const address = prisma.customerAddress.findUnique({
      where: { id: id },
    });

    if (!address) {
      return responseWrapper(
        404,
        null,
        `Addresss with given id ${params.id} not found.`,
      );
    }

    await prisma.customerAddress.delete({
      where: { id: id },
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}
