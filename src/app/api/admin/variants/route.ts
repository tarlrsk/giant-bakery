import { formatDate } from "@/lib/formatDate";
import { bucket } from "@/lib/gcs/gcs";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { prisma } from "@/lib/prisma";
import { variantValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import type { VariantType } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

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

    if (!image) {
      return responseWrapper(400, null, "Invalid image file.");
    }

    let newVariant = await prisma.variant.create({
      data: {
        name: name,
        type: type,
        isActive: isActive,
        isVisualized: isVisualized,
      },
    });

    const buffer = Buffer.from(await image.arrayBuffer());

    const imagePath = `variants/${type}/${newVariant.id}`;

    const imageFileName = `${formatDate(
      new Date(Date.now()).toString(),
    )}_${image.name.replace(/\s/g, "_")}`;

    const gcsFile = bucket.file(`${imagePath}/${imageFileName}`);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    const imageUrl = await getFileUrl(`${imagePath}/${imageFileName}`);

    newVariant.imageFileName = imageFileName;
    newVariant.image = imageUrl;

    return responseWrapper(201, newVariant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}
