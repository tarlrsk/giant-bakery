import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { prismaCart } from "@/persistence/cart";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { CartType, SnackBoxType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { updateQtyCartValidateSchema } from "@/lib/validationSchema";
import { CalGeneralDiscount, CalSnackBoxDiscount, FindSuggestDiscounts } from "@/lib/discount";

const CartInclude = {
  items: {
    include: {
      customerCake: {
        include: {
          cake: true,
          size: true,
          base: true,
          filling: true,
          cream: true,
          topEdge: true,
          bottomEdge: true,
          decoration: true,
          surface: true,
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
    case "CUSTOM_CAKE":
      if (!cartItem.customerCakeId) {
        return responseWrapper(
          500,
          null,
          `Something went wrong with custom cake item.`,
        );
      }
      await prisma.customerCake.delete({
        where: {
          id: cartItem.customerCakeId,
        },
      });
      break;

    case "PRESET_CAKE":
      if (!cartItem.customerCakeId) {
        return responseWrapper(
          500,
          null,
          `Something went wrong with custom cake item.`,
        );
      }
      await prisma.customerCake.delete({
        where: {
          id: cartItem.customerCakeId,
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
      if (cartItem.type === SnackBoxType.CUSTOM) {
        await prisma.snackBox.delete({
          where: {
            id: cartItem.snackBoxId,
          },
        });
        break;
      }
      await prisma.cartItem.delete({
        where: {
          id: itemId,
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
  const userId = req.nextUrl.searchParams.get("userId") as string;

  return await APIgetCartItems(userId);
}

export async function APIgetCartItems(userId: string | null | undefined) {
  try {
    let responseCart = {
      cartId: null as string | null,
      userId: null as string | null,
      type: null as CartType | null,
      subTotal: 0,
      suggestDiscounts: [] as string[],
      discounts: [] as any,
      totalDiscount: 0,
      total: 0,
      items: [] as any,
    };

    if (!userId) {
      return responseWrapper(200, responseCart, null);
    }
    responseCart.userId = userId;

    const cart = await prismaCart().getCartByUserId(userId);
    if (!cart) {
      return responseWrapper(200, responseCart, null);
    }

    // PREPARING DISCOUNT SNACK BOX
    let snackBoxQty = 0;
    let snackBoxTotalPrice = 0;
    let generalTotalPrice = 0;

    responseCart.cartId = cart.id;
    responseCart.type = cart.type;
    responseCart.subTotal = 0;
    for (var item of cart.items) {
      let baseResponse = {
        itemId: "",
        itemType: item.type,
        pricePer: 0,
        price: 0,
      };
      let responseItem: any;
      switch (item.type) {
        case "PRESET_CAKE":
          baseResponse.pricePer = item.customerCake?.price || 0;
          responseItem = { ...baseResponse, ...item.customerCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem.cake &&
            responseItem.cake.imagePath &&
            responseItem.cake.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.cake.imagePath);
          }

          generalTotalPrice += responseItem.price
          delete responseItem.cake;

          break;
        case "CUSTOM_CAKE":
          baseResponse.pricePer = item.customerCake?.price || 0;
          responseItem = { ...baseResponse, ...item.customerCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem.cake &&
            responseItem.cake.imagePath &&
            responseItem.cake.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.cake.imagePath);
          }
          if (responseItem.cream && responseItem.cream.imagePath) {
            responseItem.cream.image = await getFileUrl(
              responseItem.cream.imagePath,
            );
          }
          if (responseItem.topEdge && responseItem.topEdge.imagePath) {
            responseItem.topEdge.image = await getFileUrl(
              responseItem.topEdge.imagePath,
            );
          }

          if (responseItem.bottomEdge && responseItem.bottomEdge.imagePath) {
            responseItem.bottomEdge.image = await getFileUrl(
              responseItem.bottomEdge.imagePath,
            );
          }

          if (responseItem.decoration && responseItem.decoration.imagePath) {
            responseItem.decoration.image = await getFileUrl(
              responseItem.decoration.imagePath,
            );
          }

          if (responseItem.surface && responseItem.surface.imagePath) {
            responseItem.surface.image = await getFileUrl(
              responseItem.surface.imagePath,
            );
          }

          generalTotalPrice += responseItem.price
          delete responseItem.cake;

          break;
        case "REFRESHMENT":
          baseResponse.pricePer = item.refreshment?.price || 0;
          responseItem = { ...baseResponse, ...item.refreshment };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem &&
            responseItem.imagePath &&
            responseItem.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.imagePath);
          }
          generalTotalPrice += responseItem.price
          break;
        case "SNACK_BOX":
          baseResponse.pricePer = item.snackBox?.price || 0;
          responseItem = { ...baseResponse, ...item.snackBox };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem &&
            responseItem.imagePath &&
            responseItem.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.imagePath);
            for (var snackBoxRefreshment of responseItem.refreshments) {
              if (snackBoxRefreshment.refreshment.imagePath) {
                snackBoxRefreshment.refreshment.image = await getFileUrl(
                  snackBoxRefreshment.refreshment.imagePath,
                );
              }
            }
          }
          snackBoxQty += item.quantity;
          snackBoxTotalPrice += responseItem.price;
          break;
      }
      responseItem.itemId = item.id;
      responseItem.quantity = item.quantity;
      responseItem.createdAt = item.createdAt;
      responseItem.updatedAt = item.updatedAt;
      responseCart.items.push(responseItem);
      responseCart.subTotal += responseItem.price;

      responseCart.discounts = [];

      // CALCULATE DISCOUNT
      let totalDiscount = 0;
      const generalDiscount = await CalGeneralDiscount(generalTotalPrice);
      if (generalDiscount) {
        totalDiscount += generalDiscount.discount;
        responseCart.discounts.push({
          name: generalDiscount.name,
          discount: generalDiscount.discount,
        });
      }

      const snackBoxDiscount = await CalSnackBoxDiscount(
        snackBoxQty,
        snackBoxTotalPrice,
      );
      if (snackBoxDiscount) {
        totalDiscount += snackBoxDiscount.discount;
        responseCart.discounts.push({
          name: snackBoxDiscount.name,
          discount: snackBoxDiscount.discount,
        });
      }

      responseCart.suggestDiscounts = await FindSuggestDiscounts(snackBoxQty, generalTotalPrice)
      responseCart.totalDiscount = totalDiscount;
      responseCart.total = responseCart.subTotal - responseCart.totalDiscount;
    }

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
