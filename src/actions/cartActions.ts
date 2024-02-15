"use server";

// import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { revalidateTag } from "next/cache";

import getCurrentUser from "./userActions";

// ----------------------------------------------------------------------

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

  const { getCart } = apiPaths();

  const res = await fetch(getCart(currentUser?.id || ""), {
    next: { tags: ["cart"] },
  });

  const data = await res.json();

  return data;
}
