import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { Cake, Refreshment } from "@prisma/client";
import { addItemToCart } from "@/actions/cartActions";

import { Card, Button } from "@nextui-org/react";

// ----------------------------------------------------------------------
type Props = {
  item: Refreshment | Cake;
  size?: "sm" | "md";
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function RefreshmentCard({ item, onClick, size = "md" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { addRefreshmentToCart } = apiPaths();

  async function handleAddToCart(itemId: string) {
    setIsLoading(true);
    try {
      await addItemToCart(addRefreshmentToCart(), itemId, 1);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  let imgSize: { width: number; height: number } = { width: 800, height: 128 };
  let padding = 12;
  let fontSize = "lg";

  if (size === "sm") {
    imgSize.width = 180;
    imgSize.height = 50;

    padding = 2;
    fontSize = "md";
  }

  return (
    <Card
      className={` bg-white pb-${
        size === "sm" ? "4 w-15" : "6 w-unit-80"
      } rounded-md shadow-md`}
    >
      <div onClick={onClick}>
        <Image
          src={(item?.image as string) ?? "/placeholder-image.jpeg"}
          alt={item?.name}
          width={imgSize.width}
          height={imgSize.height}
          className=" object-cover mb-4 rounded-sm"
          // TODO: test if this works properly (Responsive approach)
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
        <article
          className={`flex flex-col flex-wrap text-pretty p-6 gap-${
            size === "sm" ? "1" : "2 items-center"
          }`}
        >
          <p
            className={`text-black truncate text-${fontSize} font-normal max-w-full`}
          >
            {item?.name}
          </p>

          {size === "sm" ? (
            <div className="flex flex-row w-full justify-between items-center ">
              <p
                className={`text-secondaryT-main text-${fontSize} font-semibold`}
              >
                ฿{item?.price?.toFixed(2) ?? 0}
              </p>
              <Button
                size={size}
                onClick={onClick}
                className={`bg-secondaryT-main items-center text-white text-${size} rounded-sm px-${padding}`}
              >
                เพิ่ม
              </Button>
            </div>
          ) : (
            <>
              <p
                className={`text-secondaryT-main text-${fontSize} font-semibold`}
              >
                ฿{item?.price?.toFixed(2) ?? 0}
              </p>
              <Button
                size={size}
                isLoading={isLoading}
                onClick={() => {
                  handleAddToCart(item?.id);
                }}
                className={`bg-secondaryT-main items-center text-white text-${size} rounded-sm px-${padding}`}
              >
                ใส่ตะกร้า
              </Button>
            </>
          )}
        </article>
      </div>
    </Card>
  );
}
