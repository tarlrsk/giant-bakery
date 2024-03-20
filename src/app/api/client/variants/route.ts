import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { VariantType } from "@/enum/variantType";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import {
  MasterCakeSize,
  MasterCakeBase,
  MasterCakeFilling,
  MasterCakeSurface,
  MasterCakeDecoration,
} from "@prisma/client";

export const revalidate = 0;

type color = {
  id: string;
  color: string | null;
  image: string | null;
};

type colorVariant = {
  id: string;
  name: string;
  colors: color[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  type: VariantType;
};

export async function GET(req: NextRequest) {
  try {
    let variants: {
      sizes: MasterCakeSize[];
      bases: MasterCakeBase[];
      fillings: MasterCakeFilling[];
      creams: colorVariant[];
      topEdges: colorVariant[];
      bottomEdges: colorVariant[];
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
        isActive: true,
        isDeleted: false,
      },
    });

    variants.bases = await prisma.masterCakeBase.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });

    variants.fillings = await prisma.masterCakeFilling.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });

    const creams = await prisma.masterCakeCream.findMany({
      where: {
        isDeleted: false,
      },
    });
    const gbCreams: colorVariant[] = [];
    for (let variant of creams) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbCreams.find((c) => c.name === variant.name);
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.CREAM,
        };
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        gbCreams.push(mapping);
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        if (
          (variant.updatedAt ?? variant.createdAt) >
          (existing.updatedAt ?? existing.createdAt)
        ) {
          existing.updatedAt = variant.updatedAt;
          existing.isActive = variant.isActive;
        }
      }
    }
    variants.creams = gbCreams;

    const topEdge = await prisma.masterCakeTopEdge.findMany({
      where: {
        isDeleted: false,
      },
    });

    const gbTopEdge: colorVariant[] = [];
    for (let variant of topEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbTopEdge.find((c) => c.name === variant.name);
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.TOP_EDGE,
        };
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        gbTopEdge.push(mapping);
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        if (
          (variant.updatedAt ?? variant.createdAt) >
          (existing.updatedAt ?? existing.createdAt)
        ) {
          existing.updatedAt = variant.updatedAt;
          existing.isActive = variant.isActive;
        }
      }
    }
    variants.topEdges = gbTopEdge;

    const bottomEdge = await prisma.masterCakeBottomEdge.findMany({
      where: {
        isDeleted: false,
      },
    });

    const gbBottomEdge: colorVariant[] = [];
    for (let variant of bottomEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbBottomEdge.find((c) => c.name === variant.name);
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.BOTTOM_EDGE,
        };
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        gbBottomEdge.push(mapping);
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        });
        if (
          (variant.updatedAt ?? variant.createdAt) >
          (existing.updatedAt ?? existing.createdAt)
        ) {
          existing.updatedAt = variant.updatedAt;
          existing.isActive = variant.isActive;
        }
      }
    }
    variants.bottomEdges = gbBottomEdge;

    variants.decorations = await prisma.masterCakeDecoration.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });
    for (let variant of variants.decorations) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.surfaces = (await prisma.masterCakeSurface.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    })) as any;
    for (let variant of variants.surfaces) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    return responseWrapper(200, variants, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
