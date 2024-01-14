import useCart from "@/hooks/useCart";
import BasketIcon from "@/components/icons/BasketIcon";

import { Button } from "@nextui-org/react";

import getCurrentUser from "../actions/getCurrentUser";
import { fetcher } from "@/utils/axios";

// ----------------------------------------------------------------------

export default async function CartPage() {
  const currentUser = await getCurrentUser();
  const { cartItemsData } = await useCart(currentUser?.id || "");

  return (
    <div className=" flex flex-col justify-center h-full items-center gap-6">
      <EmptyCartView />
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
