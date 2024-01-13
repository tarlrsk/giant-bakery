import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { arraysEqual } from "@/lib/arrayTool";
import { Cart, SnackBoxCart } from "@prisma/client";
import { GenerateObjectIdString } from "@/lib/objectId";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartSnackBoxValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartSnackBoxValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { refreshmentIds, type, userId, quantity } = body;
    const refreshments = await prisma.refreshment.findMany({
      where: {
        id: { in: refreshmentIds },
        isDeleted: false,
      },
    });

    const allRefreshmentsFound = refreshmentIds.every((id: string) =>
      refreshments.some((refreshment) => refreshment.id === id),
    );

    if (!allRefreshmentsFound) {
      return responseWrapper(
        404,
        null,
        "One or more refreshmentIds not found.",
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
      cart.snackBox = [];
      cart.type = type;
      cart.userId = userId;
    }

    const existingSnackBoxItem = cart.snackBox.findIndex((item) =>
      arraysEqual(item.refreshmentIds, refreshmentIds),
    );

    if (existingSnackBoxItem !== -1) {
      cart.snackBox[existingSnackBoxItem].quantity += quantity;
    } else {
      if (!cart.snackBox) {
        cart.snackBox = [];
      }

      const snackBoxItem = {
        itemId: GenerateObjectIdString(),
        refreshmentIds: refreshmentIds,
        quantity: quantity,
      } as SnackBoxCart;
      cart.snackBox.push(snackBoxItem);
    }

    const updatedCart = await prisma.cart.upsert({
      create: cart,
      update: {
        snackBox: cart.snackBox,
      },
      where: { id: cart.id || "" },
    });

    return responseWrapper(200, updatedCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
