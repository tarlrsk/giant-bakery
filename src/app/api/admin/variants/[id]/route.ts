import { formatDate } from "@/lib/formatDate";
import { bucket } from "@/lib/gcs/gcs";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { prisma } from "@/lib/prisma";
import { variantValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import type { VariantType } from "@prisma/client";
import { NextRequest } from "next/server";

type GetVariantById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    let variant = await prisma.variant.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    const newFileUrl = await getFileUrl(variant.imageFileName as string);

    variant = await prisma.variant.update({
      where: { id: id },
      data: {
        image: newFileUrl,
      },
    });

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}`);
  }
}

export async function PUT(req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const variant = await prisma.variant.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    const image = formData.get("image") as File | null;

    let imageFileName = variant.imageFileName as string;

    if (image) {
      const oldImage = bucket.file(variant.imageFileName as string);
      await oldImage.delete();

      const buffer = Buffer.from(await image.arrayBuffer());
      const updatedImageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name}`;
      const gcsFile = bucket.file(updatedImageFileName);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
    }

    const name = formData.get("name") as string;
    const type = formData.get("type") as VariantType;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const isVisualized = parseBoolean(formData.get("isVisualized") as string);
    const imageUrl = await getFileUrl(imageFileName);

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
      isVisualized,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    const updatedVariant = await prisma.variant.update({
      where: { id: variant.id },
      data: {
        name: name,
        imageFileName: imageFileName,
        image: imageUrl,
        type: type,
        isActive: isActive,
        isVisualized: isVisualized,
      },
    });

    return responseWrapper(200, updatedVariant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}`);
  }
}

export async function DELETE(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    const variant = await prisma.variant.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    const deletedVariant = await prisma.variant.update({
      where: { id: variant.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now()),
      },
    });

    // const oldImage = bucket.file(variant.imageFileName as string);
    // await oldImage.delete();

    return responseWrapper(200, deletedVariant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}`);
  }
}
