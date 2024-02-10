import React from "react";
import Image from "next/image";

import { Card, Button } from "@nextui-org/react";

type Props = {
  name: string;
  price: number;
  img: string;
  size?: "sm" | "md";
  onClick?: () => void;
};

export default function ProductCard({
  name,
  price,
  img,
  onClick,
  size = "md",
}: Props) {
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
        size === "sm" ? "4" : "6"
      } rounded-md shadow-md`}
    >
      <div onClick={onClick}>
        <Image
          src={img}
          alt={name}
          width={imgSize.width}
          height={imgSize.height}
          className=" object-cover mb-4 rounded-sm"
        />
        <article
          className={`flex flex-col flex-wrap text-pretty px-6 gap-${
            size === "sm" ? "1" : "2 items-center"
          }`}
        >
          <p
            className={`text-black truncate text-${fontSize} font-normal max-w-full`}
          >
            {name}
          </p>

          {size === "sm" ? (
            <div className="flex flex-row w-full justify-between items-center ">
              <p
                className={`text-secondaryT-main text-${fontSize} font-semibold`}
              >
                ฿{price.toFixed(2)}
              </p>
              <Button
                size={size}
                onClick={onClick}
                className={`bg-secondaryT-main items-center text-white text-${size} rounded-sm px-${padding}`}
              >
                ใส่ตะกร้า
              </Button>
            </div>
          ) : (
            <>
              <p
                className={`text-secondaryT-main text-${fontSize} font-semibold`}
              >
                ฿{price.toFixed(2)}
              </p>
              <Button
                size={size}
                onClick={onClick}
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
