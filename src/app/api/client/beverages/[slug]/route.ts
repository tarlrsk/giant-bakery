import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

type GetBeverageBySlug = {
  params: {
    slug: string;
  };
};

export async function GET(req: NextRequest, { params }: GetBeverageBySlug) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const { slug } = params;

    const beverage = await prisma.refreshment.findFirst({
      where: {
        id: id,
        name: slug,
        isActive: true,
        isDeleted: false,
      },
      include: {
        unitType: true,
      },
    });

    if (!beverage) {
      return responseWrapper(
        404,
        null,
        `${slug} with given id ${id} not found.`,
      );
    }

    if (beverage.imagePath != null && beverage.imagePath != "") {
      beverage.image = await getFileUrl(beverage.imagePath);
    }

    return responseWrapper(200, beverage, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
