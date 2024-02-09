import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const customCakes = await prisma.customCake.findMany({
      where: { isActive: true },
    });

    if (customCakes.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    return responseWrapper(200, customCakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
