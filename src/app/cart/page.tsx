import { cookies } from "next/headers";
import { getCart } from "@/utils/api-path";
import InfoIcon from "@/components/icons/InfoIcon";
import getCurrentUser from "@/actions/getCurrentUser";
import BasketIcon from "@/components/icons/BasketIcon";
import CartItemTable from "@/components/cart-table/CartItemTable";
import CartSummaryTable from "@/components/cart-table/CartSummaryTable";

import { Button } from "@nextui-org/react";

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
  const res: Repository = await getCartData();

  const items = res.response.data.items;
  const price = res.response.data.totalPrice;

  const hasItem = items?.length === 0;

  const discount: string =
    "สั่งเบเกอรี่หรือเค้กเพิ่มอีก 695 บาทเพื่อรับส่วนลด 5%";

  return (
    <div
      className={`flex flex-col  h-full ${
        hasItem ? "justify-start pt-20" : "justify-center"
      } items-center gap-6`}
    >
      {hasItem ? <ItemCartView discount={discount} /> : <EmptyCartView />}
    </div>
  );
}

// ----------------------------------------------------------------------

function ItemCartView({ discount }: { discount: string }) {
  const item = {
    name: "เอแคลร์",
    imageUrl:
      "https://image.makewebeasy.net/makeweb/m_1920x0/Ub8wb5z91/Homemadebakery2022/14_%E0%B9%80%E0%B8%AD%E0%B9%81%E0%B8%84%E0%B8%A5%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2%E0%B9%82%E0%B8%AE%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%94.jpg",
    description: "ไส้นมฮอกไกโด",
    amount: 2,
    price: 49,
    totalPrice: 98,
  };

  return (
    <div className="container px-6">
      <h1 className="text-2xl md:text-3xl font-medium text-left mb-4">
        ตะกร้าของฉัน
      </h1>
      <div className="flex flex-row w-full items-center px-2 py-4 bg-secondaryT-lighter text-secondaryT-dark rounded-sm mb-4 gap-2 mt-2">
        <InfoIcon width={24} height={24} className=" fill-secondaryT-dark" />
        <p className="text-sm md:text-base mt-0.5">{discount}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-4 ">
          <CartItemTable items={[item]} />
        </div>
        <div className="md:col-span-2">
          <CartSummaryTable />
          <Button
            fullWidth
            size="lg"
            color="secondary"
            className=" font-medium text-xl rounded-none"
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

// ----------------------------------------------------------------------

async function getCartData() {
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
