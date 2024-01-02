import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

// ----------------------------------------------------------------------

type GetAddressByUserIdProps = {
  params: {
    userId: string;
  };
};

export async function GET(
  _req: NextRequest,
  { params }: GetAddressByUserIdProps,
) {
  try {
    const { userId } = params;

    const userAddresses = await prisma.customerAddress.findMany({
      where: { userId: userId },
    });

    if (!userAddresses) {
      return responseWrapper(
        404,
        null,
        `The user with given id ${userId} does not have any addresses.`,
      );
    }

    return responseWrapper(200, userAddresses, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}.`,
    );
  }
}
