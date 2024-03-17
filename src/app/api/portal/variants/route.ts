import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { NextRequest } from "next/server";
import { validate as isValidUUID } from "uuid";
import { VariantType } from "@/enum/variantType";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { formatFileDate } from "@/lib/formatFileDate";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { variantValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

type fileImage = {
  imageFileName: string;
  imagePath: string;
};

type color = {
  id: string;
  color: string | null;
  image: string | null;
};

type colorVariant = {
  id: string;
  name: string;
  colors: color[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  type: VariantType;
};

async function uploadVariantFile(
  image: File,
  type: VariantType,
  variantId: string,
): Promise<fileImage> {
  const imageFileName = `${formatFileDate(
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
    const color = formData.get("color") as string | null;

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
    const variants: any = [];

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

        if (!color) {
          return responseWrapper(400, null, "Color is required")
        }

        newVariant = (await prisma.masterCakeCream.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
            color: color
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

        if (!color) {
          return responseWrapper(400, null, "Color is required")
        }

        newVariant = (await prisma.masterCakeTopEdge.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
            color: color,
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

        if (!color) {
          return responseWrapper(400, null, "Color is required")
        }

        newVariant = (await prisma.masterCakeBottomEdge.create({
          data: {
            id: variantId,
            name: name,
            isActive: isActive,
            imageFileName: imageFile.imageFileName,
            imagePath: imageFile.imagePath,
            color: color,
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

export async function GET(_req: NextRequest) {
  try {
    let variants: any[] = [];

    const creams = (await prisma.masterCakeCream.findMany({
      where: {
        isDeleted: false,
      },
    }));
    const gbCreams: colorVariant[] = []
    for (let variant of creams) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbCreams.find(c => c.name == variant.name)
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.CREAM
        }
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        gbCreams.push(mapping)
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        if ((variant.updatedAt ?? variant.createdAt) > (existing.updatedAt ?? existing.createdAt)) {
          existing.updatedAt = variant.updatedAt
          existing.isActive = variant.isActive
        }
      }
    }
    variants.push(...gbCreams);

    const topEdge = (await prisma.masterCakeTopEdge.findMany({
      where: {
        isDeleted: false,
      },
    }));

    const gbTopEdge: colorVariant[] = []
    for (let variant of topEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbTopEdge.find(c => c.name == variant.name)
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.TOP_EDGE
        }
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        gbTopEdge.push(mapping)
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        if ((variant.updatedAt ?? variant.createdAt) > (existing.updatedAt ?? existing.createdAt)) {
          existing.updatedAt = variant.updatedAt
          existing.isActive = variant.isActive
        }
      }
    }
    variants.push(...gbTopEdge);

    const bottomEdge = (await prisma.masterCakeBottomEdge.findMany({
      where: {
        isDeleted: false,
      },
    }))

    const gbBottomEdge: colorVariant[] = []
    for (let variant of bottomEdge) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      const existing = gbBottomEdge.find(c => c.name == variant.name)
      if (!existing) {
        let mapping: colorVariant = {
          id: variant.id,
          name: variant.name,
          colors: [],
          isActive: variant.isActive,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          isDeleted: variant.isDeleted,
          deletedAt: variant.deletedAt,
          type: VariantType.BOTTOM_EDGE
        }
        mapping.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        gbBottomEdge.push(mapping)
      } else {
        existing.colors.push({
          id: variant.id,
          color: variant.color,
          image: variant.image,
        })
        if ((variant.updatedAt ?? variant.createdAt) > (existing.updatedAt ?? existing.createdAt)) {
          existing.updatedAt = variant.updatedAt
          existing.isActive = variant.isActive
        }
      }
    }
    variants.push(...gbBottomEdge);

    const decoration = (await prisma.masterCakeDecoration.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (let variant of decoration) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      variant.type = VariantType.DECORATION;
      variants.push(variant);
    }

    const surface = (await prisma.masterCakeSurface.findMany({
      where: {
        isDeleted: false,
      },
    })) as any;
    for (let variant of surface) {
      if (variant.imagePath) {
        variant.image = await getFileUrl(variant.imagePath);
      }
      variant.type = VariantType.SURFACE;
      variants.push(variant);
    }

    return responseWrapper(200, variants, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest,) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;
    const color = formData.get("color") as string | null;
    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    let variant: any = null;

    const validation = variantValidationSchema.safeParse({
      name,
      type,
      isActive,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    switch (type) {
      case VariantType.SIZE:
        variant = (await prisma.masterCakeSize.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.BASE:
        variant = (await prisma.masterCakeBase.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.FILLING:
        variant = (await prisma.masterCakeFilling.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        break;
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
    }

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    let imageFileName = variant.imageFileName as string;
    let imagePath = variant.imagePath as string;

    if (image) {
      const oldImage = bucket.file(variant.imagePath as string);
      await oldImage.delete();

      const buffer = Buffer.from(await image.arrayBuffer());

      const updatedImageFileName = `${formatFileDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      imagePath = `variants/${type}/${variant.id}/${updatedImageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
    }

    switch (type) {
      case VariantType.SIZE:
        variant = (await prisma.masterCakeSize.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.BASE:
        variant = (await prisma.masterCakeBase.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.FILLING:
        variant = (await prisma.masterCakeFilling.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
          },
        })) as any;

        break;
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
            color: color,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
            color: color,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
            color: color,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            name: name,
            isActive: isActive,
            imageFileName: imageFileName,
            imagePath: imagePath,
          },
        })) as any;
        if (variant.imagePath) {
          variant.image = await getFileUrl(variant.imagePath);
        }
        break;
    }

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}