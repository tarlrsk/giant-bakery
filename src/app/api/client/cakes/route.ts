import { prisma } from "@/lib/prisma";
import { CakeType } from "@prisma/client";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") as CakeType;

    const cakes = await prisma.cake.findMany({
      where: {
        type: type !== null && String(type) !== "" ? type : undefined,
        isActive: true,
        isDeleted: false,
      },
    });

    if (cakes.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    return responseWrapper(200, cakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
