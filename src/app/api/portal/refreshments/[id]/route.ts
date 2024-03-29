import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { validate as isValidUUID } from "uuid";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { formatFileDate } from "@/lib/formatFileDate";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { refreshmentValidationSchema } from "@/lib/validationSchema";
import {
  StockStatus,
  type RefreshmentType,
  type RefreshmentCategory,
} from "@prisma/client";
// ----------------------------------------------------------------------

type GetRefreshmentById = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetRefreshmentById) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    let refreshment = await prisma.refreshment.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${id} not found.`,
      );
    }

    const imagePath = `refreshments/${refreshment.category}/${refreshment.id}/${refreshment.imageFileName}`;

    const newFileUrl = await getFileUrl(imagePath);

    const status: StockStatus = StockStatus.OUT_OF_STOCK;
    if (refreshment.currQty > 0) {
      if (refreshment.currQty <= refreshment.minQty) {
        refreshment.status = StockStatus.LOW;
      } else {
        refreshment.status = StockStatus.IN_STOCK;
      }
    }

    refreshment = await prisma.refreshment.update({
      where: { id: id },
      data: {
        image: newFileUrl,
        imagePath: imagePath,
        status: status,
      },
    });

    return responseWrapper(200, refreshment, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetRefreshmentById) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const formData = await req.formData();

    const refreshment = await prisma.refreshment.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${id} not found.`,
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as RefreshmentType;
    const category = formData.get("category") as RefreshmentCategory;
    const minQty = parseInt(formData.get("minQty") as string);
    const currQty = parseInt(formData.get("currQty") as string);
    const remark = formData.get("remark") as string;
    const unitType = formData.get("unitType") as string;
    const qtyPerUnit = Number(formData.get("qtyPerUnit")) as number;
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const isActive = parseBoolean(formData.get("isActive") as string);

    const validation = refreshmentValidationSchema.safeParse({
      name,
      description,
      type,
      category,
      minQty,
      currQty,
      weight,
      height,
      length,
      width,
      price,
      isActive,
      unitType,
      remark,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    const image = formData.get("image") as File | null;

    let imageFileName = refreshment.imageFileName as string;
    let imageUrl = refreshment.image as string;
    let imagePath = refreshment.imagePath as string;

    if (image) {
      try {
        const oldImage = bucket.file(refreshment.imagePath as string);
        await oldImage.delete();
      } catch (err: any) {
        console.log(err);
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      const updatedImageFileName = `${formatFileDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      imagePath = `refreshments/${category}/${refreshment.id}/${imageFileName}`;
      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
      imageUrl = await getFileUrl(imageFileName);
    }

    const updatedRefreshment = await prisma.refreshment.update({
      where: { id: refreshment.id },
      data: {
        name: name,
        description: description,
        imageFileName: imageFileName,
        image: imageUrl,
        imagePath: imagePath,
        type: type,
        category: category,
        minQty: minQty,
        currQty: currQty,
        weight: weight,
        height: height,
        length: length,
        width: width,
        price: price,
        isActive: isActive,
        unitType: unitType,
        qtyPerUnit: qtyPerUnit,
        remark: remark,
      },
    });

    revalidatePath(paths.bakeryList());
    revalidatePath(paths.beverageList());
    revalidatePath(paths.cakeList());

    return responseWrapper(200, updatedRefreshment, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: GetRefreshmentById,
) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const refreshment = await prisma.refreshment.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${id} not found.`,
      );
    }

    await prisma.refreshment.update({
      where: { id: refreshment.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now()),
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        refreshmentId: id,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        snackBox: {
          refreshments: {
            some: {
              refreshmentId: id,
            },
          },
        },
      },
    });

    revalidatePath(paths.bakeryList());
    revalidatePath(paths.beverageList());
    revalidatePath(paths.cakeList());

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
