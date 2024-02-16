import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { RefreshmentType, RefreshmentCategory } from "@prisma/client";
import { getFileUrl } from "@/lib/gcs/getFileUrl";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get(
      "category",
    ) as RefreshmentCategory;

    const refreshments = await prisma.refreshment.findMany({
      where: {
        type: RefreshmentType.BAKERY,
        category:
          category !== null && String(category) !== "" ? category : undefined,
        isActive: true,
        isDeleted: false,
      },
      include: {
        unitType: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    if (refreshments.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    refreshments.forEach(async (refreshment) => {
      if (refreshment.imagePath != null && refreshment.imagePath != "")
        refreshment.image = await getFileUrl(refreshment.imagePath);
    });

    return responseWrapper(200, refreshments, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
