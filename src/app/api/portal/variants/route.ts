import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { formatDate } from "@/lib/formatDate";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import type { VariantType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { variantValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const type = formData.get("type") as VariantType;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const isVisualized = parseBoolean(formData.get("isVisualized") as string);
    const image = formData.get("image") as File | null;

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
      isVisualized,
      image,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    if (!image) {
      return responseWrapper(400, null, "Invalid image file.");
    }

    const imageFileName = `${formatDate(
      new Date(Date.now()).toString(),
    )}_${image.name.replace(/\s/g, "_")}`;

    let newVariant = await prisma.variant.create({
      data: {
        name: name,
        type: type,
        imageFileName: imageFileName,
        isActive: isActive,
        isVisualized: isVisualized,
      },
    });

    const buffer = Buffer.from(await image.arrayBuffer());

    const imagePath = `variants/${type}/${newVariant.id}/${imageFileName}`;

    const gcsFile = bucket.file(imagePath);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    const imageUrl = await getFileUrl(imagePath);

    newVariant = await prisma.variant.update({
      where: { id: newVariant.id },
      data: {
        imageFileName: imageFileName,
        image: imageUrl,
      },
    });

    return responseWrapper(201, newVariant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}
