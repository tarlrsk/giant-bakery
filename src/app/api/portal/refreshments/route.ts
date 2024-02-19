import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/formatDate";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { refreshmentValidationSchema } from "@/lib/validationSchema";
import type {
  StockStatus,
  RefreshmentType,
  RefreshmentCategory,
} from "@prisma/client";

// ----------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    let refreshments = await prisma.refreshment.findMany({
      where: { isDeleted: false },
    });

    for (var refreshment of refreshments) {
      if (refreshment.imagePath) {
        refreshment.image = await getFileUrl(refreshment.imagePath);
      }
    }

    return responseWrapper(200, refreshments, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as RefreshmentType;
    const category = formData.get("category") as RefreshmentCategory;
    const status = formData.get("status") as StockStatus;
    const remark = formData.get("remark") as string;
    const quantity = Number(formData.get("quantity")) as number | null;
    const unitType = formData.get("unitType") as string;
    const minQty = parseInt(formData.get("minQty") as string);
    const maxQty = parseInt(formData.get("maxQty") as string);
    const currQty = parseInt(formData.get("currQty") as string);
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const unitRatio = Number(formData.get("unitRatio")) as number | null;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;

    const validation = refreshmentValidationSchema.safeParse({
      name,
      description,
      type,
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
      image,
      quantity,
      unitType,
      remark,
    });

    if (!validation.success) {
      return responseWrapper(400, null, JSON.parse(validation.error.message));
    }

    let newRefreshment = await prisma.refreshment.create({
      data: {
        name: name,
        description: description,
        type: type,
        category: category,
        status: status,
        minQty: minQty,
        maxQty: maxQty,
        currQty: currQty,
        weight: weight,
        height: height,
        length: length,
        width: width,
        unitType: unitType,
        unitRatio: unitRatio,
        price: price,
        isActive: isActive,
        quantity: quantity ?? 0,
        remark: remark,
      },
    });

    if (image) {
      if (!image) {
        return responseWrapper(400, null, "Invalid image file.");
      }

      const imageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

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
        data: {
          image: imageUrl,
          imageFileName: imageFileName,
          imagePath: imagePath,
        },
      });
    }

    revalidatePath(paths.bakeryList());
    revalidatePath(paths.beverageList());
    revalidatePath(paths.cakeList());

    return responseWrapper(201, newRefreshment, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}
