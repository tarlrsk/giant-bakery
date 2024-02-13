import Link from "next/link";
import InfoIcon from "@/components/icons/InfoIcon";
import getCurrentUser from "@/actions/userActions";
import BasketIcon from "@/components/icons/BasketIcon";
import CartItemTable from "@/components/cart-table/CartItemTable";
import { getCartData, updateCartItem } from "@/actions/cartActions";
import CartSummaryTable from "@/components/cart-table/CartSummaryTable";

import { Button } from "@nextui-org/react";

import { ICartItem } from "./types";

// ----------------------------------------------------------------------

interface ICartResponse {
  response: {
    data: {
      cartId: string | null;
      userId: string | null;
      type: string;
      totalPrice: number;
      items: ICartItem[];
    };
  };
}

// ----------------------------------------------------------------------

export default function CartPage() {
  return (
    <div className="container px-6 h-screen pt-20">
      <div
        className={`flex flex-col  h-full justify-center items-center gap-6`}
      >
        <ItemCartView />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

async function ItemCartView() {
  const currentUser = await getCurrentUser();
  const res: ICartResponse = await getCartData();

  const items = res.response.data.items;

  const discount: string =
    "สั่งเบเกอรี่หรือเค้กเพิ่มอีก 695 บาทเพื่อรับส่วนลด 5%";

  if (items.length < 1) {
    return <EmptyCartView />;
  }

  return (
    <div className="container px-6">
      <h1 className="text-2xl md:text-3xl font-medium text-left mb-4">
        ตะกร้าของฉัน
      </h1>
      <div className="flex flex-row w-full items-center px-2 py-4 bg-secondaryT-lighter text-secondaryT-dark rounded-sm mb-6 gap-2 mt-2">
        <InfoIcon width={24} height={24} className=" fill-secondaryT-dark" />
        <p className="text-sm md:text-base mt-0.5">{discount}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-4 ">
          <CartItemTable
            userId={currentUser?.id || ""}
            items={items}
            onUpdateCartItem={updateCartItem}
          />
        </div>
        <div className="md:col-span-2">
          <CartSummaryTable />
          <Button
            href="/cart/checkout"
            as={Link}
            color="secondary"
            size="lg"
            className=" font-medium text-xl rounded-none"
            fullWidth
          >
            ดำเนินการต่อ
          </Button>
        </div>
      </div>
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
