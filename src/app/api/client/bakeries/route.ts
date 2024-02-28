import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { RefreshmentType, RefreshmentCategory } from "@prisma/client";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get(
      "category",
    ) as RefreshmentCategory;

    const amounString = req.nextUrl.searchParams.get("amount") as string;

    const amount = parseInt(amounString, 10);

    const bakeries = await prisma.refreshment.findMany({
      where: {
        type: RefreshmentType.BAKERY,
        OR: [
          { category: category === "CAKE" ? "CAKE" : undefined },
          {
            AND: [
              { category: { not: "CAKE" } },
              { category: category ? { equals: category } : undefined },
            ],
          },
        ],
        isActive: true,
        isDeleted: false,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      take: amount ? amount : undefined,
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
