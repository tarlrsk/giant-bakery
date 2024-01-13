import mongoose from "mongoose";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { arraysEqual } from "@/lib/arrayTool";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { Cart, CakeType, CustomCakeCart } from "@prisma/client";
import { cartCustomCakeValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartCustomCakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { cakeId, variantIds, type, userId, quantity } = body;
    const cake = await prisma.cake.findUnique({
      where: {
        id: cakeId,
        isDeleted: false,
        type: CakeType.CUSTOM,
      },
      include: {
        variants: true,
      },
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `Custom Cake with given id ${cakeId} not found.`,
      );
    }

    const variantsExist = variantIds.every((variantId: string) =>
      cake.variants.some((variant) => variant.id === variantId),
    );

    if (!variantsExist) {
      return responseWrapper(
        400,
        null,
        "Provided variantIds are not part of the custom cake.",
      );
    }

    let cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
        type: type,
      },
    });

    if (!cart) {
      cart = {} as Cart;
      cart.id = new mongoose.Types.ObjectId().toString();
      cart.customCake = [];
      cart.type = type;
      cart.userId = userId;
    }

    const existingCakeIndex = cart.customCake.findIndex(
      (item) =>
        item.cakeId === cakeId && arraysEqual(item.variantIds, variantIds),
    );

    if (existingCakeIndex !== -1) {
      cart.customCake[existingCakeIndex].quantity += quantity;
    } else {
      if (!cart.customCake) {
        cart.customCake = [];
      }

      const customCakeItem = {
        cakeId: cakeId,
        quantity: quantity,
        variantIds: variantIds,
      } as CustomCakeCart;
      cart.customCake.push(customCakeItem);
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        customCake: cart.customCake,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
