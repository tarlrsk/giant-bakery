"use server";

// import toast from "react-hot-toast";
import paths from "@/utils/api-path";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

import getCurrentUser from "./userActions";

// ----------------------------------------------------------------------

export async function updateCartItem(
  userId: string,
  type: string,
  itemId: string,
  quantity: number,
  action: "increase" | "decrease" | "remove",
) {
  const { updateCartItem, deleteCartItem } = paths();

  const updatedQuantity = action === "increase" ? quantity + 1 : quantity - 1;
  const isDeleted = action === "remove" || updatedQuantity === 0;

  const res = await fetch(
    isDeleted ? deleteCartItem(userId, itemId) : updateCartItem,
    {
      method: isDeleted ? "DELETE" : "PUT",
      body: JSON.stringify({ userId, type, itemId, updatedQuantity }),
    },
  );
  const data = await res.json();
  revalidateTag("cart");

  return data;
}

export async function getCartData() {
  const currentUser = await getCurrentUser();
  const userId =
    currentUser?.id ||
    `COOKIE_ID_${cookies().get("next-auth.csrf-token")?.value as string}`;

  const { getCart } = paths();

  const res = await fetch(getCart(userId), { next: { tags: ["cart"] } });

  if (!res.ok) {
    return {
      response: {
        data: {
          totalPrice: 0,
          items: [],
        },
      },
    };
  }

  const data = await res.json();

  return data;
}
