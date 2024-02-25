import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/formatDate";
import { parseBoolean } from "@/lib/parseBoolean";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { presetSnackBoxesValidateSchema } from "@/lib/validationSchema";
import {
  SnackBoxType,
  SnackBoxBeverage,
  SnackBoxPackageType,
} from "@prisma/client";

// ----------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  try {
    const snackBoxes = await prisma.snackBox.findMany({
      where: {
        isDeleted: false,
        type: SnackBoxType.PRESET,
      },
      include: {
        refreshments: {
          include: {
            refreshment: true,
          },
        },
      },
    });

    for (var snackBox of snackBoxes) {
      if (snackBox.imagePath) {
        (snackBox as any).image = await getFileUrl(snackBox.imagePath);
      }

      for (var snackBoxRefreshment of snackBox.refreshments) {
        if (snackBoxRefreshment.refreshment.imagePath) {
          snackBoxRefreshment.refreshment.image = await getFileUrl(
            snackBoxRefreshment.refreshment.imagePath,
          );
        }
      }
    }

    return responseWrapper(200, snackBoxes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const refreshmentIds = formData.getAll("refreshmentIds") as string[];
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;

    const validation = presetSnackBoxesValidateSchema.safeParse({
      name,
      weight,
      height,
      length,
      width,
      price,
      isActive,
      image,
      refreshmentIds,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    for (var refreshmentId of refreshmentIds) {
      let refreshment = await prisma.refreshment.findUnique({
        where: { id: refreshmentId },
      });

      if (!refreshment) {
        return responseWrapper(
          404,
          null,
          `Variant with given id ${refreshmentId} not found.`,
        );
      }
    }

    let newSnackBox = await prisma.snackBox.create({
      data: {
        name: name,
        description: description,
        price: price,
        weight: weight,
        height: height,
        length: length,
        width: width,
        isActive: isActive,
        type: SnackBoxType.PRESET,
        refreshments: {
          create: refreshmentIds.map((refreshmentId: string) => ({
            refreshment: { connect: { id: refreshmentId } },
          })),
        },
      },
      include: {
        refreshments: {
          include: {
            refreshment: true,
          },
        },
      },
    });

    let snackBoxResponse: any = newSnackBox;
    if (image) {
      if (!image) {
        return responseWrapper(400, null, "Invalid image file.");
      }

      const imageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      const imagePath = `snackBoxes/${newSnackBox.id}/${imageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      const imageUrl = await getFileUrl(imagePath);

      snackBoxResponse = await prisma.snackBox.update({
        where: { id: newSnackBox.id },
        data: {
          imageFileName: imageFileName,
          imagePath: imagePath,
        },
        include: {
          refreshments: {
            include: {
              refreshment: true,
            },
          },
        },
      });

      snackBoxResponse.image = imageUrl;
    }

    revalidatePath(paths.snackBoxList());

    return responseWrapper(201, snackBoxResponse, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}
