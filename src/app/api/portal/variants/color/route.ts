import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { VariantType } from "@/enum/variantType";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { variantByTypeValidateSchema } from "@/lib/validationSchema";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body;

    const validation = variantByTypeValidateSchema.safeParse({
      id,
      type,
    });
    if (!validation.success) {
      return responseWrapper(400, null, validation.error.message);
    }

    let variant: any = null;

    switch (type) {
      case VariantType.CREAM:
        variant = (await prisma.masterCakeCream.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(404, null, "Variant is not found.");
        }

        variant = await prisma.masterCakeCream.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            image: null,
            imageFileName: null,
            imagePath: null,
          },
        });

        await prisma.customerCake.deleteMany({
          where: {
            creamId: id,
          },
        });

        break;
      case VariantType.TOP_EDGE:
        variant = (await prisma.masterCakeTopEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(404, null, "Variant is not found.");
        }

        variant = await prisma.masterCakeTopEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            image: null,
            imageFileName: null,
            imagePath: null,
          },
        });

        await prisma.customerCake.deleteMany({
          where: {
            topEdgeId: id,
          },
        });

        break;
      case VariantType.BOTTOM_EDGE:
        variant = (await prisma.masterCakeBottomEdge.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(404, null, "Variant is not found.");
        }

        variant = await prisma.masterCakeBottomEdge.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            image: null,
            imageFileName: null,
            imagePath: null,
          },
        });

        await prisma.customerCake.deleteMany({
          where: {
            bottomEdgeId: id,
          },
        });

        break;
      case VariantType.DECORATION:
        variant = (await prisma.masterCakeDecoration.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(404, null, "Variant is not found.");
        }

        variant = await prisma.masterCakeDecoration.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            image: null,
            imageFileName: null,
            imagePath: null,
          },
        });

        await prisma.customerCake.deleteMany({
          where: {
            decorationId: id,
          },
        });

        break;
      case VariantType.SURFACE:
        variant = (await prisma.masterCakeSurface.findFirst({
          where: {
            id: id,
            isDeleted: false,
          },
        })) as any;

        if (!variant) {
          return responseWrapper(404, null, "Variant is not found.");
        }

        variant = await prisma.masterCakeSurface.update({
          where: {
            id: id,
            isDeleted: false,
          },
          data: {
            image: null,
            imageFileName: null,
            imagePath: null,
          },
        });

        await prisma.customerCake.deleteMany({
          where: {
            surfaceId: id,
          },
        });

        break;
    }

    if (!variant) {
      return responseWrapper(
        404,
        null,
        `Variant with given id ${id} not found.`,
      );
    }

    return responseWrapper(200, variant, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
