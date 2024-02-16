import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { RefreshmentType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const type: RefreshmentType = "BEVERAGE";

    const refreshments = await prisma.refreshment.findMany({
      where: {
        type: type,
        isActive: true,
        isDeleted: false,
      },
      include: {
        unitType: true,
      },
      orderBy: { name: "asc" },
    });

    if (refreshments.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    return responseWrapper(200, refreshments, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
