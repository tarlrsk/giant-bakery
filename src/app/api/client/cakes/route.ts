import { prisma } from "@/lib/prisma";
import { CakeType } from "@prisma/client";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") as CakeType;

    const cakes = await prisma.cake.findMany({
      where: {
        type: type !== null && String(type) !== "" ? type : undefined,
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
      orderBy: { name: "asc" },
    });

    if (cakes.length === 0) {
      return responseWrapper(200, null, "No Content");
    }

    for (var cake of cakes) {
      if (cake.imagePath) {
        cake.image = await getFileUrl(cake.imagePath);
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
    }

    return responseWrapper(200, cakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
