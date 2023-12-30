import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const uid: string = params.id;
  try {
    const userAddresses = await prisma.customerAddress.findUnique({
      // FIXME: what is happening here
      where: { userId: uid },
    });
    return responseWrapper(200, userAddresses, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const addressId: string = params.id;

  try {
    const body = await req.json();

    const updated = await prisma.customerAddress.update({
      where: { id: addressId },
      data: body,
    });
    return responseWrapper(200, updated, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const addressId: string = params.id;

  try {
    const deleted = await prisma.customerAddress.delete({
      where: { id: addressId },
    });
    return responseWrapper(200, deleted, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}
