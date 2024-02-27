"use client";
import { useRouter } from "next/navigation";
import BasketIcon from "@/components/icons/BasketIcon";

import { Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

export default function CartEmptyView() {
  const router = useRouter();
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
      <Button
        color="secondary"
        className="md:w-40 md:h-12 md:text-xl"
        onClick={() => router.push("/")}
      >
        กลับสู่หน้าแรก
      </Button>
    </>
  );
}
