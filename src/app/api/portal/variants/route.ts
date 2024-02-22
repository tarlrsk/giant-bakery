import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { formatDate } from "@/lib/formatDate";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { variantValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

enum VariantType {
  SIZE = "SIZE",
  BASE = "BASE",
  FILLING = "FILLING",
  CREAM = "CREAM",
  TOP_EDGE = "TOP_EDGE",
  BOTTOM_EDGE = "BOTTOM_EDGE",
  DECORATION = "DECORATION",
  SURFACE = "SURFACE",
}

type fileImage = {
  imageFileName: string;
  imagePath: string;
};

async function uploadVariantFile(
  image: File,
  type: VariantType,
  variantId: string,
): Promise<fileImage> {
  const imageFileName = `${formatDate(
    new Date(Date.now()).toString(),
  )}_${image.name.replace(/\s/g, "_")}`;
  const buffer = Buffer.from(await image.arrayBuffer());

  const imagePath = `variants/${type}/${variantId}/${imageFileName}`;

  const gcsFile = bucket.file(imagePath);

  await gcsFile.save(buffer, {
    metadata: {
      contentType: image.type,
    },
  });

  var file = {
    imageFileName: imageFileName,
    imagePath: imagePath,
  } as fileImage;

  return file;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const type = formData.get("type") as VariantType;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
      image,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    let newVariant: any = {};

    const variantId = uuidv4();
    switch (type) {
      case VariantType.SIZE:
        newVariant = (await prisma.masterCakeSize.create({
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        newVariant.type = type;
        break;
      case VariantType.BASE:
        newVariant = (await prisma.masterCakeBase.create({
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        newVariant.type = type;
        break;
      case VariantType.FILLING:
        newVariant = (await prisma.masterCakeFilling.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
          },
        })) as any;

        newVariant.type = type;
        break;
      case VariantType.CREAM:
        if (!image) {
          return responseWrapper(400, null, "Image is required");
        }
        var imageFile = await uploadVariantFile(image, type, variantId);

        newVariant = (await prisma.masterCakeCream.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
          },
        })) as any;

        newVariant.type = type;
        newVariant.image = await getFileUrl(imageFile.imagePath);
        break;
      case VariantType.TOP_EDGE:
        if (!image) {
          return responseWrapper(400, null, "Image is required");
        }
        var imageFile = await uploadVariantFile(image, type, variantId);

        newVariant = (await prisma.masterCakeTopEdge.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
          },
        })) as any;

        newVariant.type = type;
        newVariant.image = await getFileUrl(imageFile.imagePath);
        break;
      case VariantType.BOTTOM_EDGE:
        if (!image) {
          return responseWrapper(400, null, "Image is required");
        }
        var imageFile = await uploadVariantFile(image, type, variantId);

        newVariant = (await prisma.masterCakeBottomEdge.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
          },
        })) as any;

        newVariant.type = type;
        newVariant.image = await getFileUrl(imageFile.imagePath);
        break;
      case VariantType.DECORATION:
        if (!image) {
          return responseWrapper(400, null, "Image is required");
        }
        var imageFile = await uploadVariantFile(image, type, variantId);

        newVariant = (await prisma.masterCakeDecoration.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
          },
        })) as any;

        newVariant.type = type;
        break;
      case VariantType.SURFACE:
        if (!image) {
          return responseWrapper(400, null, "Image is required");
        }
        var imageFile = await uploadVariantFile(image, type, variantId);

        newVariant = (await prisma.masterCakeSurface.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
          },
        })) as any;

        newVariant.type = type;
        break;
    }

    return responseWrapper(201, newVariant, null);
  } catch (err: any) {
    return responseWrapper(500, null, `Something went wrong.\n ${err.message}`);
  }
}

export async function GET(req: NextRequest) {
  try {
    let variants: any = {};

    variants.sizes = (await prisma.masterCakeSize.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;

    variants.base = (await prisma.masterCakeBase.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;

    variants.fillings = (await prisma.masterCakeFilling.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;

    variants.creams = (await prisma.masterCakeCream.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.creams) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.topEdge = (await prisma.masterCakeTopEdge.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.topEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.bottomEdge = (await prisma.masterCakeBottomEdge.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.bottomEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.decoration = (await prisma.masterCakeDecoration.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.decoration) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    variants.surface = (await prisma.masterCakeSurface.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (var variant of variants.surface) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
    }

    return responseWrapper(200, variants, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
