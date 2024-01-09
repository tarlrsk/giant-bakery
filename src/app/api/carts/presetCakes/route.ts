import { prisma } from "@/lib/prisma";
import { cartCustomCakeValidationSchema, cartPresetCakeValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";
import { CakeType, Cart, CartType } from "@prisma/client";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartPresetCakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { cakeId, type, userId, quantity } = body;
    const cake = await prisma.cake.findUnique({
      where: {
        id: cakeId,
        isDeleted: false,
        type: CakeType.PRESET
      },
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `Preset Cake with given id ${cakeId} not found.`,
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
      cart.presetCake = [];
      cart.type = type;
      cart.userId = userId;
    }
    const presetCakeItem = {
      cakeId: cakeId,
      quantity: quantity,
    };

    const existingCakeIndex = cart.presetCake.findIndex(
      (item) =>
        item.cakeId === cakeId,
    );

    if (existingCakeIndex !== -1) {
      cart.presetCake[existingCakeIndex].quantity += quantity;
    } else {
      if (!cart.presetCake) {
        cart.presetCake = [];
      }
      cart.presetCake.push(presetCakeItem);
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        presetCake: cart.presetCake,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
