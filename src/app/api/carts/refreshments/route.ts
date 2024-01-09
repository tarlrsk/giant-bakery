import { prisma } from "@/lib/prisma";
import { cartRefreshmentValidationSchema } from "@/lib/validation-schema";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";
import { Cart } from "@prisma/client";
import mongoose from "mongoose";

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
      cart.id = new mongoose.Types.ObjectId().toString();
      cart.refreshment = [];
      cart.type = type;
      cart.userId = userId;
    }

    const existingRefreshmentItem = cart.refreshment.findIndex(
      (item) => item.refreshmentId === refreshmentId,
    );

    if (existingRefreshmentItem !== -1) {
      cart.refreshment[existingRefreshmentItem].quantity += quantity;
    } else {
      if (!cart.refreshment) {
        cart.refreshment = [];
      }
      cart.refreshment.push({
        refreshmentId: refreshmentId,
        quantity: quantity,
      });
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        refreshment: cart.refreshment,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
