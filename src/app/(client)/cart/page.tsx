import Link from "next/link";
import getCurrentUser from "@/actions/userActions";
import CartEmptyView from "@/components/CartEmptyView";
import CartItemTable from "@/components/cart-table/CartItemTable";
import { getCartData, updateCartItem } from "@/actions/cartActions";
import CartSummaryTable from "@/components/cart-table/CartSummaryTable";
import CheckoutButtonModal from "@/components/modal/CheckoutButtonModal";

import { Button } from "@nextui-org/react";

import { ICartItem } from "./types";

// ----------------------------------------------------------------------

interface ICartResponse {
  response: {
    data: {
      cartId: string | null;
      userId: string | null;
      type: "CUSTOMER" | "GUEST";
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
      <div className={`flex flex-col items-center justify-center gap-6`}>
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
    return <CartEmptyView />;
  }

  return (
    <div className="container px-6">
      <h1 className="mb-4 text-left text-2xl font-medium md:text-3xl">
        ตะกร้าของฉัน
      </h1>
      {suggestDiscounts.length > 0 && (
        <div className=" mb-3 mt-5 text-gray-500">
          {suggestDiscounts.map((el: string, index: number) => (
            <p key={index} className="text-xs  font-normal md:text-sm ">
              {el}
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        <div className="md:col-span-4 ">
          <CartItemTable
            userId={currentUser?.id || ""}
            userType={(currentUser?.role as "CUSTOMER" | "GUEST") || "GUEST"}
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
          {currentUser?.role === "GUEST" ? (
            <CheckoutButtonModal />
          ) : (
            <Button
              href="/cart/checkout"
              as={Link}
              color="secondary"
              size="lg"
              className=" mt-4 rounded-none text-lg font-medium md:text-xl"
              fullWidth
            >
              ดำเนินการต่อ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
