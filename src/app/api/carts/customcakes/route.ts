import { prisma } from "@/lib/prisma";
import { cartCustomCakeValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";
import { Cart, CartType } from "@prisma/client";
import mongoose from "mongoose";
import { arraysEqual } from "@/lib/arrayTool";

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
      },
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `Cake with given id ${cakeId} not found.`,
      );
    }

    for (var variantId of variantIds) {
      let variant = await prisma.variant.findUnique({
        where: {
          id: variantId,
          isActive: true,
        },
      });

      if (!variant) {
        return responseWrapper(
          404,
          null,
          `Variant with given id ${variantId} not found.`,
        );
      }
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
    const customCakeItem = {
      cakeId: cakeId,
      quantity: quantity,
      variantIds: variantIds,
    };

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
