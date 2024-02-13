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
  const { updateCartItem, deleteCartItem } = apiPaths();

  const updatedQuantity: number =
    action === "increase" ? quantity + 1 : quantity - 1;
  const isDeleted = action === "remove" || updatedQuantity === 0;

  const res = await fetch(
    isDeleted ? deleteCartItem(userId, itemId) : updateCartItem,
    {
      method: isDeleted ? "DELETE" : "PUT",
      body: JSON.stringify({ userId, itemId, quantity: updatedQuantity }),
      cache: "no-store",
    },
  );
  revalidateTag("cart");

  const data = await res.json();

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
