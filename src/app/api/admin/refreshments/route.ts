import { formatDate } from "@/lib/formatDate";
import { bucket } from "@/lib/gcs/gcs";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { prisma } from "@/lib/prisma";
import { refreshmentValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import type { RefreshmentCategory, StockStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as RefreshmentCategory;
    const status = formData.get("status") as StockStatus;
    const minQty = parseInt(formData.get("minQty") as string);
    const maxQty = parseInt(formData.get("maxQty") as string);
    const currQty = parseInt(formData.get("currQty") as string);
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const isActive = parseBoolean(formData.get("isActive") as string);

    const validation = refreshmentValidationSchema.safeParse({
      name,
      description,
      category,
      status,
      minQty,
      maxQty,
      currQty,
      weight,
      height,
      length,
      width,
      price,
      isActive,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    const image = formData.get("image") as File | null;

    if (!image) {
      return responseWrapper(400, null, "Invalid image file.");
    }

    const imageFileName = `${formatDate(
      new Date(Date.now()).toString(),
    )}_${image.name.replace(/\s/g, "_")}`;

    let newRefreshment = await prisma.refreshment.create({
      data: {
        name: name,
        description: description,
        imageFileName: imageFileName,
        category: category,
        status: status,
        minQty: minQty,
        maxQty: maxQty,
        currQty: currQty,
        weight: weight,
        height: height,
        length: length,
        width: width,
        price: price,
        isActive: isActive,
      },
    });

    const buffer = Buffer.from(await image.arrayBuffer());

    const imagePath = `refreshments/${category}/${newRefreshment.id}/${imageFileName}`;

    const gcsFile = bucket.file(imagePath);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    const imageUrl = await getFileUrl(imagePath);

    newRefreshment = await prisma.refreshment.update({
      where: { id: newRefreshment.id },
      data: { image: imageUrl },
    });

    return responseWrapper(201, newRefreshment, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}
