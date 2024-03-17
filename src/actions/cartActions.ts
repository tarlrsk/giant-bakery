"use server";

// import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { revalidateTag } from "next/cache";
import { APIgetCartItems } from "@/app/api/client/carts/route";

import getCurrentUser from "./userActions";

// ----------------------------------------------------------------------

type IAddCustomSnackBoxToCart = {
  packageType: "PAPER_BAG" | "SNACK_BOX_S" | "SNACK_BOX_M";
  beverage: "INCLUDE" | "EXCLUDE" | "NONE";
  refreshmentIds: string[];
  quantity: number;
};

type IAddCakeToCart = {
  cakeId: string;
  cakeType: "PRESET" | "CUSTOM";
  sizeId: string;
  baseId: string;
  fillingId: string;
  quantity: number;
};

// ----------------------------------------------------------------------

export async function addPresetCakeToCartAction(
  url: string,
  body: IAddCakeToCart,
) {
  try {
    const currentUser = await getCurrentUser();
    const request = {
      userId: currentUser?.id || "GUEST",
      type: currentUser?.role || "GUEST",
      cakeId: body.cakeId,
      cakeType: body.cakeType,
      sizeId: body.sizeId,
      fillingId: body.fillingId,
      quantity: body.quantity,
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      cache: "no-store",
    });

    revalidateTag("cart");
    const data = await res.json();

    if (!data.response.success) throw new Error(data.response.error);

    return data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

export async function addCustomSnackBoxToCartAction(
  url: string,
  body: IAddCustomSnackBoxToCart,
) {
  try {
    const currentUser = await getCurrentUser();

    const request = {
      userId: currentUser?.id || "GUEST",
      type: currentUser?.role || "GUEST",
      packageType: body.packageType,
      beverage: body.beverage,
      refreshmentIds: body.refreshmentIds,
      quantity: body.quantity,
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      cache: "no-store",
    });

    revalidateTag("cart");
    const data = await res.json();
    if (!data.response.success) throw new Error(data);

    return data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

export async function addItemToCart(
  url: string,
  itemId: string,
  quantity: number,
) {
  try {
    const currentUser = await getCurrentUser();

    const body = {
      userId: currentUser?.id || "GUEST",
      type: currentUser?.role || "GUEST",
      refreshmentId: itemId,
      snackBoxId: itemId,
      quantity: quantity,
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    });

    revalidateTag("cart");
    const data = await res.json();
    if (!data.response.success) throw new Error(data);

    return data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  type: "CUSTOMER" | "GUEST",
  quantity: number,
  action: "increase" | "decrease" | "remove" | "replace",
) {
  try {
    const { updateCartItem } = apiPaths();

    let updatedQuantity;

    if (action === "increase") {
      updatedQuantity = quantity + 1;
    } else if (action === "decrease") {
      updatedQuantity = quantity - 1;
    } else if (action === "replace") {
      updatedQuantity = quantity;
    } else {
      updatedQuantity = 0;
    }

    const res = await fetch(updateCartItem(), {
      method: "PUT",
      body: JSON.stringify({ userId, itemId, type, quantity: updatedQuantity }),
      cache: "no-store",
    });

    revalidateTag("cart");
    const data = await res.json();
    if (!data.response.success) throw new Error(data);

    return data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

export async function getCartData() {
  const currentUser = await getCurrentUser();

  const data = await APIgetCartItems(currentUser?.id);

  return data.json();
}
