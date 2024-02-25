import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { formatDate } from "@/lib/formatDate";
import { validate as isValidUUID } from "uuid";
import { parseBoolean } from "@/lib/parseBoolean";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import {
  variantValidationSchema,
  variantByTypeValidateSchema,
} from "@/lib/validationSchema";
import { VariantType } from "@/enum/variantType";

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

export async function PUT(req: NextRequest, { params }: GetVariantById) {
  try {
    const { type, id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;

    let variant: any = null;

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

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

    let imageFileName = variant.imageFileName as string;
    let imagePath = variant.imagePath as string;

    if (image) {
      const oldImage = bucket.file(variant.imagePath as string);
      await oldImage.delete();

      const buffer = Buffer.from(await image.arrayBuffer());

      const updatedImageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      imagePath = `variants/${type}/${variant.id}/${updatedImageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
    }

    switch (type) {
      case VariantType.SIZE:
        variant = (await prisma.masterCakeSize.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.BASE:
        variant = (await prisma.masterCakeBase.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.FILLING:
        variant = (await prisma.masterCakeFilling.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
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

        variant = (await prisma.masterCakeCream.update({
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

        variant = (await prisma.masterCakeTopEdge.update({
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

        variant = (await prisma.masterCakeBottomEdge.update({
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
