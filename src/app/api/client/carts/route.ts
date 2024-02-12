import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { CartType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { updateQtyCartValidateSchema } from "@/lib/validationSchema";

const CartInclude = {
  items: {
    include: {
      presetCake: {
        include: {
          variants: true,
        },
      },
      customCake: {
        include: {
          cake: true,
          variants: true,
        },
      },
      refreshment: true,
      snackBox: {
        include: {
          refreshments: {
            include: {
              refreshment: true,
            },
          },
        },
      },
    },
  },
};

async function deleteItem(cartItem: any, itemId: string) {
  switch (cartItem.type) {
    case "PRESET_CAKE":
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
      break;
    case "CUSTOM_CAKE":
      if (!cartItem.customCakeId) {
        return responseWrapper(
          500,
          null,
          `Something went wrong with custom cake item.`,
        );
      }
      await prisma.customCake.delete({
        where: {
          id: cartItem.customCakeId,
        },
      });
      break;

    case "REFRESHMENT":
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
      break;
    case "SNACK_BOX":
      if (!cartItem.snackBoxId) {
        return responseWrapper(
          500,
          null,
          `Something went wrong with snack box item.`,
        );
      }
      await prisma.snackBox.delete({
        where: {
          id: cartItem.snackBoxId,
        },
      });
      break;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") as string;
    if (!userId) {
      return responseWrapper(400, null, "UserId is required");
    }

    const itemId = req.nextUrl.searchParams.get("itemId") as string;
    if (!itemId) {
      return responseWrapper(400, null, "ItemId is required");
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: CartInclude,
    });

    if (!cart) {
      return responseWrapper(
        404,
        null,
        `Cart with given user id ${userId} is not found.`,
      );
    }

    const cartItem = cart.items.find((item) => item.id === itemId);
    if (!cartItem) {
      return responseWrapper(
        404,
        null,
        `Item with giver id ${itemId} is not found.`,
      );
    }
    deleteItem(cartItem, itemId);
    cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: CartInclude,
    });

    return responseWrapper(200, cart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    // TODO GET USER ID FROM TOKEN OR COOKIE ID
    const body = await req.json();
    const validation = updateQtyCartValidateSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { userId, quantity, itemId, type } = body;

    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
      include: CartInclude,
    });
    if (!cart) {
      return responseWrapper(
        404,
        null,
        `Cart with given user id ${userId} is not found.`,
      );
    }

    let cartItem = cart.items.find((item) => item.id === itemId);
    if (!cartItem) {
      return responseWrapper(
        404,
        null,
        `Item with giver id ${itemId} is not found.`,
      );
    }

    if (quantity === 0) {
      deleteItem(cartItem, itemId);
    } else {
      cartItem = await prisma.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: quantity,
        },
        include: CartInclude.items.include,
      });
    }

    return responseWrapper(200, cart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function GET(req: NextRequest) {
  try {
    let responseCart = {
      cartId: null as string | null,
      userId: null as string | null,
      type: null as CartType | null,
      totalPrice: 0,
      items: [] as any,
    };

    const userId = req.nextUrl.searchParams.get("userId") as string;
    if (!userId) {
      return responseWrapper(200, responseCart, null);
    }
    responseCart.userId = userId;

    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: CartInclude,
    });
    if (!cart) {
      return responseWrapper(200, responseCart, null);
    }

    responseCart.cartId = cart.id;
    responseCart.type = cart.type;
    responseCart.totalPrice = 0;
    cart.items.forEach((item) => {
      let baseResponse = {
        itemId: "",
        itemType: item.type,
        pricePer: 0,
        price: 0,
      };
      let responseItem: any;
      switch (item.type) {
        case "PRESET_CAKE":
          baseResponse.pricePer = item.presetCake?.price || 0;
          responseItem = { ...baseResponse, ...item.presetCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          break;
        case "CUSTOM_CAKE":
          baseResponse.pricePer = item.customCake?.price || 0;
          responseItem = { ...baseResponse, ...item.customCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          break;
        case "REFRESHMENT":
          baseResponse.pricePer = item.refreshment?.price || 0;
          responseItem = { ...baseResponse, ...item.refreshment };
          responseItem.price = baseResponse.pricePer * item.quantity;
          break;
        case "SNACK_BOX":
          baseResponse.pricePer = item.snackBox?.price || 0;
          responseItem = { ...baseResponse, ...item.snackBox };
          responseItem.price = baseResponse.pricePer * item.quantity;
          break;
      }
      responseItem.itemId = item.id;
      responseItem.quantity = item.quantity;
      responseItem.createdAt = item.createdAt;
      responseItem.updatedAt = item.updatedAt;
      responseCart.items.push(responseItem);
      responseCart.totalPrice += responseItem.price;
    });

    responseCart.items.sort(
      (
        a: { createdAt: { getTime: () => number } },
        b: { createdAt: { getTime: () => number } },
      ) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      },
    );

    return responseWrapper(200, responseCart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
