"use server";

import paths from "@/utils/paths";
// import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { CartType } from "@prisma/client";
import { prismaCart } from "@/persistence/cart";
import { revalidatePath } from "next/cache";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

import getCurrentUser from "./userActions";

// ----------------------------------------------------------------------

export async function updateCartItem(
  userId: string,
  itemId: string,
  type: string,
  quantity: number,
  action: "increase" | "decrease" | "remove",
) {
  try {
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

    revalidatePath(paths.cartList());
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getCartData() {
  const currentUser = await getCurrentUser();

  try {
    let responseCart = {
      cartId: null as string | null,
      userId: null as string | null,
      type: null as CartType | null,
      subTotal: 0,
      discounts: [] as any,
      totalDiscount: 0,
      total: 0,
      items: [] as any,
    };

    const userId = currentUser?.id;
    if (!userId) {
      return responseWrapper(200, responseCart, null).json();
    }
    responseCart.userId = userId;

    const cart = await prismaCart().getCartByUserId(userId);
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

      // TODO Discounts
      responseCart.discounts = [
        {
          name: "ร้านกำลังอยู่ในช่วงพัฒนา ลดให้เลย 10 บาท",
          discount: 10,
        },
        {
          name: "พอดีเป็นคนใจดีน่ะ ลดให้เลย 10 บาท",
          discount: 10,
        },
      ];

      responseCart.totalDiscount = 20;
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

    return responseWrapper(200, responseCart, null).json();
  } catch (err: any) {
    return responseWrapper(500, null, err.message).json();
  }
}
