import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { bucket } from "@/lib/gcs/gcs";
import { CakeType } from "@prisma/client";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/formatDate";
import { validate as isValidUUID } from "uuid";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { parseBoolean } from "@/lib/parseBoolean";
import { cakeValidationSchema } from "@/lib/validationSchema";
import { responseWrapper } from "@/utils/api-response-wrapper";

// ----------------------------------------------------------------------

type GetCakeByIdProps = {
  params: {
    id: string;
  };
};

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

export async function GET(_req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const cake = await prisma.cake.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: CakeInclude,
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }

    if (cake.imagePath) {
      cake.image = await getFileUrl(cake.imagePath);
    }

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

    return responseWrapper(200, cake, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }
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
    const sizeIds = formData.getAll("sizeIds") as string[];
    const baseIds = formData.getAll("baseIds") as string[];
    const fillingIds = formData.getAll("fillingIds") as string[];
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

    const cake = await prisma.cake.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        sizes: true,
        bases: true,
        fillings: true,
        creams: true,
        topEdges: true,
        bottomEdges: true,
        decorations: true,
        surfaces: true,
      },
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }

    let imageFileName = cake.imageFileName as string;
    let imagePath = cake.imagePath as string;

    if (image) {
      try {
        const oldImage = bucket.file(cake.imagePath as string);
        await oldImage.delete();
      } catch (err: any) {
        console.log(err);
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      const updatedImageFileName = `${formatDate(
        new Date(Date.now()).toString(),
      )}_${image.name.replace(/\s/g, "_")}`;

      imagePath = `cakes/${type}/${cake.id}/${imageFileName}`;

      const gcsFile = bucket.file(imagePath);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      imageFileName = updatedImageFileName;
    }

    const updatedCake = await prisma.cake.update({
      where: {
        id: cake.id,
      },
      data: {
        name: name,
        remark: remark,
        type: type,
        price: price,
        weight: weight,
        description: description,
        height: height,
        length: length,
        width: width,
        imageFileName: imageFileName,
        imagePath: imagePath,
        image: await getFileUrl(imagePath),
        isActive: isActive,
        sizes: {
          deleteMany: {},
          connect: sizeIds.map((id) => ({ id: id })),
        },
        bases: {
          deleteMany: {},
          connect: baseIds.map((id) => ({ id: id })),
        },
        fillings: {
          deleteMany: {},
          connect: fillingIds.map((id) => ({ id: id })),
        },
        creams: {
          deleteMany: {},
          connect: creamIds.map((id) => ({ id: id })),
        },
        topEdges: {
          deleteMany: {},
          connect: topEdgeIds.map((id) => ({ id: id })),
        },
        bottomEdges: {
          deleteMany: {},
          connect: bottomEdgeIds.map((id) => ({ id: id })),
        },
        decorations: {
          deleteMany: {},
          connect: decorationIds.map((id) => ({ id: id })),
        },
        surfaces: {
          deleteMany: {},
          connect: surfaceIds.map((id) => ({ id: id })),
        },
      },
      include: CakeInclude,
    });

    revalidatePath(paths.cakeList());

    return responseWrapper(200, updatedCake, null);
  } catch (err: any) {
    return responseWrapper(
      500,
      null,
      `Something went wrong. \n Error: ${err.message}`,
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: GetCakeByIdProps) {
  try {
    const { id } = params;

    if (!isValidUUID(id)) {
      return responseWrapper(400, null, "Invalid Object Id.");
    }

    const cake = await prisma.cake.findUnique({
      where: { id: id, isDeleted: false },
      include: {
        sizes: true,
        bases: true,
        fillings: true,
        creams: true,
        topEdges: true,
        bottomEdges: true,
        decorations: true,
        surfaces: true,
      },
    });

    if (!cake) {
      return responseWrapper(404, null, `Cake with given id ${id} not found.`);
    }

    await prisma.cake.update({
      where: { id: cake.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now()),
      },
      include: {
        sizes: true,
        bases: true,
        fillings: true,
        creams: true,
        topEdges: true,
        bottomEdges: true,
        decorations: true,
        surfaces: true,
      },
    });

    revalidatePath(paths.cakeList());

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
