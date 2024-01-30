import React from "react";
import Image from "next/image";

import { Card, Button } from "@nextui-org/react";

type Props = {
  name: string;
  price: number;
  img: string;
};

export default function ProductCard({ name, price, img }: Props) {
  return (
    <Card className="flex flex-col items-center justify-center bg-white p-4 rounded-md shadow-md">
      <div className="w-44 flex-col justify-start items-center gap-1 inline-flex">
        <Image
          src={img}
          alt={name}
          width={1000}
          height={128}
          className="w-full h-32 object-cover mb-4 rounded-md"
        />
        <div className="flex-col justify-start items-center gap-1 flex">
          <p className="text-black text-xl font-normal">{name}</p>
          <p className="text-secondaryT-main text-xl font-semibold">
            ฿{price.toFixed(2)}
          </p>
          <Button className="w-32 h-10 bg-secondaryT-main items-center text-white text-base font-semibold rounded-full relative">
            ใส่ตะกร้า
          </Button>
        </div>
      </div>
    </Card>
  );
}
