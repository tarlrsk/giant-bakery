import mongoose from "mongoose";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Cart, RefreshmentCart } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartRefreshmentValidationSchema } from "@/lib/validation-schema";
import { GenerateObjectIdString } from "@/lib/objectId";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartRefreshmentValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { refreshmentId, type, userId, quantity } = body;
    const refreshment = await prisma.refreshment.findUnique({
      where: {
        id: refreshmentId,
        isDeleted: false,
      },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${refreshmentId} not found.`,
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
      cart.refreshments = [];
      cart.type = type;
      cart.userId = userId;
    }

    const existingRefreshmentItem = cart.refreshments.findIndex(
      (item) => item.refreshmentId === refreshmentId,
    );

    if (existingRefreshmentItem !== -1) {
      cart.refreshments[existingRefreshmentItem].quantity += quantity;
    } else {
      if (!cart.refreshments) {
        cart.refreshments = [];
      }

      const refreshmentItem = {
        itemId: GenerateObjectIdString(),
        refreshmentId: refreshmentId,
        quantity: quantity,
      } as RefreshmentCart;
      cart.refreshments.push(refreshmentItem);
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        refreshments: cart.refreshments,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
