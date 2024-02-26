import Link from "next/link";
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
      type: "MEMBER" | "GUEST";
      subTotal: number;
      discounts: {
        name: string;
        discount: number;
      }[];
      suggestDiscounts: string[];
      totalDiscount: number;
      total: number;
      items: ICartItem[];
    };
  };
}

// ----------------------------------------------------------------------

export default function CartPage() {
  return (
    <div className="py-20">
      <div className={`flex flex-col justify-center items-center gap-6`}>
        <ItemCartView />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

async function ItemCartView() {
  const currentUser = await getCurrentUser();
  const res: ICartResponse = await getCartData();
  const cartData = res?.response?.data;
  const suggestDiscounts = cartData?.suggestDiscounts || [];

  const items = cartData?.items;

  if (items?.length < 1) {
    return <EmptyCartView />;
  }

  return (
    <div className="container px-6">
      <h1 className="text-2xl md:text-3xl font-medium text-left mb-4">
        ตะกร้าของฉัน
      </h1>
      {suggestDiscounts.length > 0 && (
        <div className=" text-gray-500 mb-3 mt-5">
          {suggestDiscounts.map((el: string, index: number) => (
            <p key={index} className=" text-sm font-normal ">
              {el}
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-4 ">
          <CartItemTable
            userId={currentUser?.id || ""}
            userType={(currentUser?.role as "MEMBER" | "GUEST") || "GUEST"}
            items={items}
            onUpdateCartItem={updateCartItem}
          />
        </div>
        <div className="md:col-span-2">
          <CartSummaryTable
            subTotal={cartData.subTotal}
            discounts={cartData.discounts}
            totalDiscount={cartData.totalDiscount}
            total={cartData.total}
          />
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
