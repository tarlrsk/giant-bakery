import paths from "@/utils/paths";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { CakeType } from "@prisma/client";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBoolean } from "@/lib/parseBoolean";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { formatFileDate } from "@/lib/formatFileDate";
import { cakeValidationSchema } from "@/lib/validationSchema";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

const CakeInclude = {
  sizes: true,
  bases: true,
  fillings: true,
  creams: true,
  topEdges: true,
  bottomEdges: true,
  decorations: true,
  surfaces: true,
};

export async function GET(_req: NextRequest) {
  try {
    const cakes = await prisma.cake.findMany({
      where: {
        isDeleted: false,
      },
      include: CakeInclude,
      orderBy: {
        name: "asc",
      },
    });

    for (var cake of cakes) {
      for (var cream of cake.creams) {
        if (cream.imagePath) {
          cream.image = await getFileUrl(cream.imagePath);
        }
      }

      for (var topEdge of cake.topEdges) {
        if (topEdge.imagePath) {
          topEdge.image = await getFileUrl(topEdge.imagePath);
        }
      }

      for (var bottomEdge of cake.bottomEdges) {
        if (bottomEdge.imagePath) {
          bottomEdge.image = await getFileUrl(bottomEdge.imagePath);
        }
      }

      for (var decoration of cake.decorations) {
        if (decoration.imagePath) {
          decoration.image = await getFileUrl(decoration.imagePath);
        }
      }

      for (var surface of cake.surfaces) {
        if (surface.imagePath) {
          surface.image = await getFileUrl(surface.imagePath);
        }
      }
    }

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
    const remark = formData.get("remark") as string;
    const type = formData.get("type") as CakeType;
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    const length = parseFloat(formData.get("length") as string);
    const width = parseFloat(formData.get("width") as string);
    const price = parseFloat(formData.get("price") as string);
    const isActive = parseBoolean(formData.get("isActive") as string);
    const image = formData.get("image") as File | null;
    const creamIds = formData.getAll("creamIds") as string[];
    const topEdgeIds = formData.getAll("topEdgeIds") as string[];
    const bottomEdgeIds = formData.getAll("bottomEdgeIds") as string[];
    const decorationIds = formData.getAll("decorationIds") as string[];
    const surfaceIds = formData.getAll("surfaceIds") as string[];

    const validation = cakeValidationSchema.safeParse({
      name,
      type,
      price,
      weight,
      height,
      length,
      width,
      isActive,
      image,
      remark,
    });

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const cakeId = uuidv4();
    let imageUrl = null;
    let imageFileName = null;
    let imagePath = null;
    if (image) {
      imageFileName = `${formatFileDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      const buffer = Buffer.from(await image.arrayBuffer());

      imagePath = `cakes/${type}/${cakeId}/${imageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageUrl = await getFileUrl(imagePath);
    }

    const sizes = await prisma.masterCakeSize.findMany();
    const bases = await prisma.masterCakeBase.findMany();
    const fillings = await prisma.masterCakeFilling.findMany();

    let newCake = await prisma.cake.create({
      data: {
        id: cakeId,
        name: name,
        description: description,
        remark: remark,
        price: price,
        weight: weight,
        height: height,
        length: length,
        width: width,
        imageFileName: imageFileName,
        imagePath: imagePath,
        image: imageUrl,
        isActive: isActive,
        sizes: {
          connect: sizes.map((size) => ({ id: size.id })),
        },
        bases: {
          connect: bases.map((base) => ({ id: base.id })),
        },
        fillings: {
          connect: fillings.map((filling) => ({ id: filling.id })),
        },
        creams: {
          connect: creamIds.map((id) => ({ id: id })),
        },
        topEdges: {
          connect: topEdgeIds.map((id) => ({ id: id })),
        },
        bottomEdges: {
          connect: bottomEdgeIds.map((id) => ({ id: id })),
        },
        decorations: {
          connect: decorationIds.map((id) => ({ id: id })),
        },
        surfaces: {
          connect: surfaceIds.map((id) => ({ id: id })),
        },
      },
      include: CakeInclude,
    });

    for (var cream of newCake.creams) {
      if (cream.imagePath) {
        cream.image = await getFileUrl(cream.imagePath);
      }
    }

    for (var topEdge of newCake.topEdges) {
      if (topEdge.imagePath) {
        topEdge.image = await getFileUrl(topEdge.imagePath);
      }
    }

    for (var bottomEdge of newCake.bottomEdges) {
      if (bottomEdge.imagePath) {
        bottomEdge.image = await getFileUrl(bottomEdge.imagePath);
      }
    }

    for (var decoration of newCake.decorations) {
      if (decoration.imagePath) {
        decoration.image = await getFileUrl(decoration.imagePath);
      }
    }

    for (var surface of newCake.surfaces) {
      if (surface.imagePath) {
        surface.image = await getFileUrl(surface.imagePath);
      }
    }

    revalidatePath(paths.cakeList());

    return responseWrapper(201, newCake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
