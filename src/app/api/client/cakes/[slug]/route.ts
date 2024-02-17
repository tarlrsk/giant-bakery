import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

type GetCakeBySlug = {
  params: {
    slug: string;
  };
};

export async function GET(req: NextRequest, { params }: GetCakeBySlug) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const { slug } = params;

    const cake = await prisma.cake.findFirst({
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

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `${slug} with given id ${id} not found.`,
      );
    }

    if (cake.imagePath != null && cake.imagePath != "") {
      cake.image = await getFileUrl(cake.imagePath);
    }
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
