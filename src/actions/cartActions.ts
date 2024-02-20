"use server";

// import toast from "react-hot-toast";
import { prisma } from "@/lib/prisma";
import apiPaths from "@/utils/api-path";
import { CartType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

import getCurrentUser from "./userActions";

// ----------------------------------------------------------------------

const CartInclude = {
  items: {
    include: {
      customerCake: {
        include: {
          cake: true,
          pound: true,
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

  const res = await fetch(updateCartItem(), {
    method: "PUT",
    body: JSON.stringify({ userId, itemId, quantity: updatedQuantity }),
    cache: "no-store",
  });

  revalidateTag("cart");

  const data = await res.json();

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
        case "CAKE":
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
