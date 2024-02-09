import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const presetCakes = await prisma.cake.findMany({
      where: { type: "PRESET", isActive: true },
    });

    if (presetCakes.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    return responseWrapper(200, presetCakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
