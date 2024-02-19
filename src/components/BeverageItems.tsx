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

type Props = {
  size?: "sm" | "md";
  cols: number;
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

export default function BeverageItems({
  size = "md",
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getBeverages, addRefreshmentToCart } = apiPaths();

  const { data } = useSWR(getBeverages(), fetcher);

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
      await triggerAddToCart(body);
      toast.success("ใส่ตะกร้าาสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  return (
    <div
      className={`grid grid-cols-${cols} gap-${
        size === "sm" ? 4 : 14
      } justify-center items-baseline hover:cursor-pointer`}
      {...other}
    >
      {Object.values(items)?.map((item: Refreshment) => (
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
              : () => router.push(`/beverages/${item.name}?id=${item.id}`)
          }
          addToCart={() => {
            handleAddToCart(item.id);
          }}
        />
      ))}
    </div>
  );
}
