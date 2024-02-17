import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { RefreshmentType } from "@prisma/client";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const type: RefreshmentType = "BEVERAGE";

    const beverages = await prisma.refreshment.findMany({
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

    if (beverages.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    for (var item of beverages) {
      if (item.imagePath != null && item.imagePath != "")
        item.image = await getFileUrl(item.imagePath);
    }

    return responseWrapper(200, beverages, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
