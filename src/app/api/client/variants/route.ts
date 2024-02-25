import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import {
  MasterCakeSize,
  MasterCakeBase,
  MasterCakeCream,
  MasterCakeFilling,
  MasterCakeTopEdge,
  MasterCakeSurface,
  MasterCakeDecoration,
  MasterCakeBottomEdge,
} from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    let variants: {
      sizes: MasterCakeSize[];
      bases: MasterCakeBase[];
      fillings: MasterCakeFilling[];
      creams: MasterCakeCream[];
      topEdges: MasterCakeTopEdge[];
      bottomEdges: MasterCakeBottomEdge[];
      decorations: MasterCakeDecoration[];
      surfaces: MasterCakeSurface[];
    } = {
      sizes: [],
      bases: [],
      fillings: [],
      creams: [],
      topEdges: [],
      bottomEdges: [],
      decorations: [],
      surfaces: [],
    };

    variants.sizes = await prisma.masterCakeSize.findMany({
      where: {
        isDeleted: false,
      },
    });

    variants.bases = await prisma.masterCakeBase.findMany({
      where: {
        isDeleted: false,
      },
    });

    variants.fillings = await prisma.masterCakeFilling.findMany({
      where: {
        isDeleted: false,
      },
    });

    variants.creams = await prisma.masterCakeCream.findMany({
      where: {
        isDeleted: false,
      },
    });
    for (var variant of variants.creams) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.topEdges = await prisma.masterCakeTopEdge.findMany({
      where: {
        isDeleted: false,
      },
    });
    for (var variant of variants.topEdges) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.bottomEdges = await prisma.masterCakeBottomEdge.findMany({
      where: {
        isDeleted: false,
      },
    });
    for (variant of variants.bottomEdges) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.decorations = await prisma.masterCakeDecoration.findMany({
      where: {
        isDeleted: false,
      },
    });
    for (var variant of variants.decorations) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.surfaces = (await prisma.masterCakeSurface.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.surfaces) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    return responseWrapper(200, variants, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
