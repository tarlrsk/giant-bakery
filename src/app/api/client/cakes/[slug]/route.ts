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
        sizes: true,
        bases: true,
        fillings: true,
        creams: true,
        topEdges: true,
        bottomEdges: true,
        decorations: true,
        surfaces: true,
      },
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `${slug} with given id ${id} not found.`,
      );
    }

    for (var cream of cake.creams) {
      if (cream.imagePath) {
        cream.image = await getFileUrl(cream.imagePath);
      }
    }

    for (var topEdge of cake.topEdges) {
      if (topEdge.imagePath) {
        topEdge.image = await getFileUrl(topEdge.imagePath);
      }
    }

    for (var bottomEdge of cake.bottomEdges) {
      if (bottomEdge.imagePath) {
        bottomEdge.image = await getFileUrl(bottomEdge.imagePath);
      }
    }

    for (var decoration of cake.decorations) {
      if (decoration.imagePath) {
        decoration.image = await getFileUrl(decoration.imagePath);
      }
    }

    for (var surface of cake.surfaces) {
      if (surface.imagePath) {
        surface.image = await getFileUrl(surface.imagePath);
      }
    }

    if (cake.imagePath != null && cake.imagePath != "") {
      cake.image = await getFileUrl(cake.imagePath);
    }

    return responseWrapper(200, cake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
