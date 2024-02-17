import { responseWrapper } from "@/utils/api-response-wrapper";
import { validate as isValidUUID } from "uuid";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { presetSnackBoxesValidateSchema } from "@/lib/validationSchema";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import {
  SnackBoxBeverage,
  SnackBoxPackageType,
  SnackBoxType,
} from "@prisma/client";
import { parseBoolean } from "@/lib/parseBoolean";
import { formatDate } from "@/lib/formatDate";
import { bucket } from "@/lib/gcs/gcs";

type GetSnackBoxByIdProps = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetSnackBoxByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const snackBox = await prisma.snackBox.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        refreshments: {
          include: {
            refreshment: true,
          },
        },
      },
    });

    if (!snackBox) {
      return responseWrapper(
        404,
        null,
        `SnackBox with given id ${id} not found.`,
      );
    }

    let snackBoxRes: any = snackBox;
    if (snackBox.imagePath) {
      snackBoxRes.Image = await getFileUrl(snackBox.imagePath);
    }

    for (var snackBoxRefreshment of snackBoxRes.refreshments) {
      if (snackBoxRefreshment.refreshment.imagePath) {
        snackBoxRefreshment.refreshment.image = await getFileUrl(
          snackBoxRefreshment.refreshment.imagePath,
        );
      }
    }

    return responseWrapper(200, snackBoxRes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetSnackBoxByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const packageType = formData.get("packageType") as SnackBoxPackageType;
    const beverage = formData.get("beverage") as SnackBoxBeverage;
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
      packageType,
      weight,
      height,
      length,
      width,
      price,
      isActive,
      image,
      refreshmentIds,
      beverage,
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

    const snackBox = await prisma.snackBox.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        refreshments: {
          include: {
            refreshment: true,
          },
        },
      },
    });

    if (!snackBox) {
      return responseWrapper(
        404,
        null,
        `SnackBox with given id ${id} not found.`,
      );
    }

    let updatedSnackBox = await prisma.snackBox.update({
      where: {
        id: snackBox.id,
      },
      data: {
        name: name,
        description: description,
        packageType: packageType,
        beverage: beverage,
        price: price,
        weight: weight,
        height: height,
        length: length,
        width: width,
        isActive: isActive,
        type: SnackBoxType.PRESET,
        refreshments: {
          deleteMany: {},
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

    if (image) {
      const imageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      const imagePath = `snackBoxes/${updatedSnackBox.id}/${imageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });
      updatedSnackBox = await prisma.snackBox.update({
        where: { id: snackBox.id },
        data: {
          imageFilename: imageFileName,
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

      (updatedSnackBox as any).image = await getFileUrl(imagePath);
    }

    return responseWrapper(200, updatedSnackBox, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong. \n Error: ${err.message}`,
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: GetSnackBoxByIdProps,
) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid");
    }

    const snackBox = await prisma.snackBox.findUnique({
      where: { id: id },
    });

    if (!snackBox) {
      return responseWrapper(
        404,
        null,
        `SnackBox with given id ${id} not found.`,
      );
    }

    await prisma.snackBox.update({
      where: { id: snackBox.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now()),
      },
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
