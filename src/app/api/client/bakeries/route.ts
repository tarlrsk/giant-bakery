import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { RefreshmentType, RefreshmentCategory } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get(
      "category",
    ) as RefreshmentCategory;

    const bakeries = await prisma.refreshment.findMany({
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

    if (bakeries.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    for (var item of bakeries) {
      if (item.imagePath != null && item.imagePath != "")
        item.image = await getFileUrl(item.imagePath);
    }

    return responseWrapper(200, bakeries, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
