import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { Cart, CakeType, PresetCakeCart } from "@prisma/client";
import { cartPresetCakeValidationSchema } from "@/lib/validationSchema";
import { GenerateObjectIdString } from "@/lib/objectId";

// ----------------------------------------------------------------------

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
        type: CakeType.PRESET,
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
      cart.id = GenerateObjectIdString();
      cart.presetCakes = [];
      cart.type = type;
      cart.userId = userId;
    }

    const existingCakeIndex = cart.presetCakes.findIndex(
      (item) => item.cakeId === cakeId,
    );

    if (existingCakeIndex !== -1) {
      cart.presetCakes[existingCakeIndex].quantity += quantity;
    } else {
      if (!cart.presetCakes) {
        cart.presetCakes = [];
      }

      const presetCakeItem = {
        itemId: GenerateObjectIdString(),
        cakeId: cakeId,
        quantity: quantity,
      } as PresetCakeCart;
      cart.presetCakes.push(presetCakeItem);
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        presetCakes: cart.presetCakes,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
