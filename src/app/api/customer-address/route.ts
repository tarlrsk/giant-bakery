import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { responseWrapper } from "@/utils/api-response-wrapper";
import { createAddressSchema } from "@/lib/validation-schema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createAddressSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const newAddress = await prisma.customerAddress.create({
      data: body,
    });

    return responseWrapper(201, newAddress, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong./n Error: ${err.message}`,
    );
  }
}
