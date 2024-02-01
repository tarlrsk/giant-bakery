import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { parseBoolean } from "@/lib/parseBoolean";
import { CakeType } from "@prisma/client";
import { formatDate } from "@/lib/formatDate";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { cakeValidationSchema } from "@/lib/validationSchema";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  try {
    const cakes = await prisma.cake.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        variants: true,
      },
    });

    return responseWrapper(200, cakes, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}.`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as CakeType;
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const isActive = parseBoolean(formData.get("isActive") as string);
    const variantIds = formData.getAll("variantIds") as string[];
    const image = formData.get("image") as File | null;

    const validation = cakeValidationSchema.safeParse({
      name,
      type,
      price,
      weight,
      height,
      length,
      width,
      isActive,
      variantIds,
      image,
      description,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    for (var variantId of variantIds) {
      let variant = await prisma.variant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return responseWrapper(
          404,
          null,
          `Variant with given id ${variantId} not found.`,
        );
      }
    }

    let newCake = await prisma.cake.create({
      data: {
        name: name,
        description: description,
        type: type,
        price: price,
        weight: weight,
        height: height,
        length: length,
        width: width,
        isActive: isActive,
        variants: {
          connect: variantIds.map((id) => ({ id: id })),
        },
      },
    });

    if (image) {
      const imageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      const imagePath = `cakes/${type}/${newCake.id}/${imageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      const imageUrl = await getFileUrl(imagePath);

      newCake = await prisma.cake.update({
        where: { id: newCake.id },
        data: { image: imageUrl, imageFileName: imageFileName },
      });
    }

    return responseWrapper(201, newCake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
