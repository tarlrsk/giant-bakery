"use server";

// import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { revalidateTag } from "next/cache";

import getCurrentUser from "./userActions";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { prisma } from "@/lib/prisma";
import { CartType } from "@prisma/client";

// ----------------------------------------------------------------------

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

export async function updateCartItem(
  userId: string,
  itemId: string,
  type: string,
  quantity: number,
  action: "increase" | "decrease" | "remove",
) {
  const { updateCartItem } = apiPaths();

  let updatedQuantity;

  if (action === "increase") {
    updatedQuantity = quantity + 1;
  } else if (action === "decrease") {
    updatedQuantity = quantity - 1;
  } else {
    updatedQuantity = 0;
  }

  const res = await fetch(updateCartItem, {
    method: "PUT",
    body: JSON.stringify({ userId, itemId, quantity: updatedQuantity }),
    cache: "no-store",
  });

  revalidateTag("cart");

  const data = await res.json();

  console.log("data", data);

  return data;
}

export async function getCartData() {
  const currentUser = await getCurrentUser();

  try {
    let responseCart = {
      cartId: null as string | null,
      userId: null as string | null,
      type: null as CartType | null,
      subTotal: 0,
      items: [] as any,
    };

    const userId = currentUser?.id;
    if (!userId) {
      return responseWrapper(200, responseCart, null).json();
    }
    responseCart.userId = userId;

    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: CartInclude,
    });
    if (!cart) {
      return responseWrapper(200, responseCart, null).json();
    }

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
          baseResponse.pricePer = item.presetCake?.price || 0;
          responseItem = { ...baseResponse, ...item.presetCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem &&
            responseItem.imagePath &&
            responseItem.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.imagePath);
          }
          break;
        case "CUSTOM_CAKE":
          baseResponse.pricePer = item.customCake?.price || 0;
          responseItem = { ...baseResponse, ...item.customCake };
          responseItem.price = baseResponse.pricePer * item.quantity;
          if (
            responseItem &&
            responseItem.imagePath &&
            responseItem.imagePath != ""
          ) {
            responseItem.image = await getFileUrl(responseItem.imagePath);
            for (var variant of responseItem.variants) {
              if (variant.imagePath) {
                variant.image = await getFileUrl(variant.imagePath);
              }
            }
          }
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
          break;
      }
      responseItem.itemId = item.id;
      responseItem.quantity = item.quantity;
      responseItem.createdAt = item.createdAt;
      responseItem.updatedAt = item.updatedAt;
      responseCart.items.push(responseItem);
      responseCart.subTotal += responseItem.price;
    }

    responseCart.items.sort(
      (
        a: { createdAt: { getTime: () => number } },
        b: { createdAt: { getTime: () => number } },
      ) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      },
    );

    return responseWrapper(200, responseCart, null).json();
  } catch (err: any) {
    return responseWrapper(500, null, err.message).json();
  }
}
