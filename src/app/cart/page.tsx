import { cookies } from "next/headers";
import { getCart } from "@/utils/api-path";
import BasketIcon from "@/components/icons/BasketIcon";

import { Button } from "@nextui-org/react";

import getCurrentUser from "../actions/getCurrentUser";

// ----------------------------------------------------------------------

type Repository = {
  response: {
    data: {
      cartId: string | null;
      userId: string | null;
      type: null;
      totalPrice: 0;
      items: [];
    };
  };
};

// ----------------------------------------------------------------------

export default async function CartPage() {
  const res: Repository = await getData();

  const items = res.response.data.items;
  const price = res.response.data.totalPrice;

  return (
    <div className=" flex flex-col justify-center h-full items-center gap-6">
      {items.length > 0 ? <div>{price}</div> : <EmptyCartView />}
    </div>
  );
}

function EmptyCartView() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <BasketIcon className="w-32 h-32 md:w-40 md:h-40" />
        <div className="flex flex-col text-center gap-2">
          <p className="text-2xl md:text-3xl font-medium ">
            ตะกร้าของคุณว่างเปล่า!
          </p>
          <p className=" text-base md:text-xl">โปรดเลือกสินค้าก่อนชำระเงิน</p>
        </div>
      </div>
      <Button color="secondary" className="md:w-40 md:h-12 md:text-xl">
        กลับสู่หน้าแรก
      </Button>
    </>
  );
}

// ----------------------------------------------------------------------

async function getData() {
  const currentUser = await getCurrentUser();

  const memberUserId = currentUser?.id;
  const guestUserId = cookies().get("next-auth.csrf-token")?.value;

  const res = await fetch(
    getCart(memberUserId || (guestUserId as unknown as string)),
  );

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

  return res.json();
}
