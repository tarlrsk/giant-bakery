import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { formatDate } from "@/lib/formatDate";
import { validate as isValidUUID } from "uuid";
import { parseBoolean } from "@/lib/parseBoolean";
import type { VariantType } from "@prisma/client";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { variantValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

type GetVariantById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

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

    const imagePath = `variants/${variant.type}/${variant.id}/${variant.imageFileName}`;

    const newFileUrl = await getFileUrl(imagePath);

    variant = await prisma.variant.update({
      where: { id: id },
      data: {
        image: newFileUrl,
        imagePath: imagePath,
      },
    });

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

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

    const name = formData.get("name") as string;
    const type = formData.get("type") as VariantType;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const isVisualized = parseBoolean(formData.get("isVisualized") as string);

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
      isVisualized,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    const image = formData.get("image") as File | null;

    let imageFileName = variant.imageFileName as string;

    if (image) {
      const oldImage = bucket.file(variant.imageFileName as string);
      await oldImage.delete();

      const buffer = Buffer.from(await image.arrayBuffer());

      const updatedImageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      const imagePath = `variants/${type}/${variant.id}/${updatedImageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
    }

    const imageUrl = await getFileUrl(imageFileName);

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
    return responseWrapper(500, null, err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: GetVariantById) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

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
    return responseWrapper(500, null, err.message);
  }
}
