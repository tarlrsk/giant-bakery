import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

type GetBakeryBySlug = {
  params: {
    slug: string;
  };
};

export async function GET(req: NextRequest, { params }: GetBakeryBySlug) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const { slug } = params;

    const bakery = await prisma.refreshment.findFirst({
      where: {
        id: id,
        name: slug,
        isActive: true,
        isDeleted: false,
      },
    });

    if (!bakery) {
      return responseWrapper(
        404,
        null,
        `${slug} with given id ${id} not found.`,
      );
    }

    if (bakery.imagePath != null && bakery.imagePath != "") {
      bakery.image = await getFileUrl(bakery.imagePath);
    }

    return responseWrapper(200, bakery, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
