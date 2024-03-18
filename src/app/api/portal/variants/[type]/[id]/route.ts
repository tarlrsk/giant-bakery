import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { validate as isValidUUID } from "uuid";
import { VariantType } from "@/enum/variantType";
import { parseBoolean } from "@/lib/parseBoolean";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { formatFileDate } from "@/lib/formatFileDate";
import { responseWrapper } from "@/utils/api-response-wrapper";
import {
  variantValidationSchema,
  variantByTypeValidateSchema,
} from "@/lib/validationSchema";

// ----------------------------------------------------------------------

type GetVariantById = {
  params: {
    type: string;
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: GetVariantById) {
  try {
    const { type, id } = params;
    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }
    const validation = variantByTypeValidateSchema.safeParse({
      id,
      type,
    });
    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    let variant: any = null;

    switch (type) {
      case VariantType.SIZE:
        variant = (await prisma.masterCakeSize.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.BASE:
        variant = (await prisma.masterCakeBase.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.FILLING:
        variant = (await prisma.masterCakeFilling.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
    }

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    variant.type = type;

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { type, id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const validation = variantByTypeValidateSchema.safeParse({
      type,
      id,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    let variant: any = null;

    switch (type) {
      case VariantType.SIZE:
        variant = (await prisma.masterCakeSize.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeSize.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        break;
      case VariantType.BASE:
        variant = (await prisma.masterCakeBase.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeBase.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        break;
      case VariantType.FILLING:
        variant = (await prisma.masterCakeFilling.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeFilling.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        break;
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeCream.updateMany({
          where: {
            name: variant.name,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeTopEdge.updateMany({
          where: {
            name: variant.name,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeBottomEdge.updateMany({
          where: {
            name: variant.name,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeDecoration.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (!variant) {
          return responseWrapper(
            404,
            null,
            `Variant with given id ${id} not found.`,
          );
        }

        variant = (await prisma.masterCakeSurface.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            deletedAt: new Date(Date.now()),
          },
        })) as any;

        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
    }

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
