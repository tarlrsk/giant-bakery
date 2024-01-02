import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

type GetAddressByUserIdProps = {
  params: {
    userId: string;
  };
};

export async function GET({ params }: GetAddressByUserIdProps) {
  try {
    const { userId } = params;

    const userAddresses = await prisma.customerAddress.findUnique({
      where: { userId },
    });

    if (!userAddresses) {
      return responseWrapper(404, null, "This user contains no addresses.");
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
