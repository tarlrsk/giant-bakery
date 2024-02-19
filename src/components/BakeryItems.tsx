"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";
import getCurrentUser from "@/actions/userActions";

import ProductCard from "./ProductCard";

// ----------------------------------------------------------------------

export type IBakeryCategory = "BREAD" | "PIE" | "COOKIE" | "SNACK" | "";

type Props = {
  size?: "sm" | "md";
  amount?: string;
  cols: number;
  category?: IBakeryCategory;
  onClick?: (selected: any) => void;
};

type IAddRefreshmentToCart = {
  userId: string;
  type: "MEMBER" | "GUEST";
  refreshmentId: string;
  quantity: number;
};

async function sendAddSnackBoxRequest(
  url: string,
  { arg }: { arg: IAddRefreshmentToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function BakeryItems({
  size = "md",
  amount,
  cols,
  category,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getBakeries, addRefreshmentToCart } = apiPaths();

  const { data } = useSWR(
    `${getBakeries(category as IBakeryCategory, amount)}`,
    fetcher,
  );

  const items: Refreshment[] = data?.response?.data || [];

  const { trigger: triggerAddToCart, isMutating: isMutatingAddToCart } =
    useSWRMutation(addRefreshmentToCart(), sendAddSnackBoxRequest);

  async function handleAddToCart(itemId: string) {
    const currentUser = await getCurrentUser();

    const body: IAddRefreshmentToCart = {
      userId: currentUser?.id || "",
      type: currentUser?.role === "CUSTOMER" ? "MEMBER" : "GUEST",
      refreshmentId: itemId,
      quantity: 1,
    };

    try {
      const res = await triggerAddToCart(body);
      console.log(res);
      console.log(body);
      toast.success("ใส่ตะกร้าาสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  return (
    <div
      className={`grid grid-cols-${cols} gap-${
        size === "sm" ? 4 : 10
      } justify-center items-baseline hover:cursor-pointer`}
      {...other}
    >
      {Object.values(items)?.map((item: any) => (
        <ProductCard
          key={item.id}
          name={item.name}
          size={size}
          price={item.price}
          img={item.image ? `${item.image as string}` : "/"}
          isLoading={isMutatingAddToCart}
          onClick={
            onClick
              ? () => onClick(item)
              : () => router.push(`/bakeries/${item.name}?id=${item.id}`)
          }
          addToCart={() => {
            handleAddToCart(item.id);
          }}
        />
      ))}
    </div>
  );
}
