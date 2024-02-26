import React from "react";
import Image from "next/image";
import { Refreshment } from "@prisma/client";

import { Button } from "@nextui-org/react";

type Props = {
  item: Refreshment;
  counter: number;
  isLoading: boolean | undefined;
  onClick: (item: any) => void;
  onChange: (e: any) => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function ProductDetail({
  item,
  counter,
  isLoading,
  onClick,
  onChange,
  onIncrement,
  onDecrement,
}: Props) {
  return (
    <div className="relative flex items-center justify-center gap-36">
      <Image
        src={
          (item?.image as string)
            ? (item?.image as string)
            : "/placeholder-image.jpeg"
        }
        alt={item?.name}
        width={420}
        height={420}
      />

      <div className="relative flex flex-col w-auto gap-8">
        <div className="relative flex flex-col gap-4">
          <div className="relative flex flex-col gap-5">
            <h1 className="font-semibold text-4xl leading-normal">
              {item?.name}
            </h1>
            <p className="font-normal text-xl">{item?.description}</p>
          </div>
          <div className="relative flex gap-6">
            <div className="relative flex gap-2">
              <h2 className="font-semibold text-xl">น้ำหนัก:</h2>
              <p className="font-normal text-xl">{item?.weight} กรัม</p>
            </div>
            <div className="relative flex gap-2">
              <h2 className="font-semibold text-xl">ปริมาณ:</h2>
              <p className="font-normal text-xl">
                1 กล่อง
                {/* {item?.unitRatio ? item?.unitRatio : "-"}{" "}
                {item?.unitType ? item?.unitType : ""} */}
              </p>
            </div>
          </div>
          <div className="font-semibold text-4xl leading-normal">
            ฿{item?.price?.toFixed(2) ?? 0}
          </div>
        </div>

        <div className="relative flex gap-10">
          <div className="relative flex border-1 rounded-[8px] border-black">
            <Button
              onClick={onDecrement}
              className="relative h-auto items-center bg-opacity-0 text-black text-2xl font-medium rounded-l-[8px] py-3"
            >
              -
            </Button>
            <input
              type="text"
              value={counter}
              onChange={onChange}
              size={counter.toString().length}
              className="relative h-auto items-center bg-opacity-0 text-center text-black text-2xl font-medium py-3"
            />
            <Button
              onClick={onIncrement}
              className="relative h-auto items-center bg-opacity-0 text-black text-2xl font-medium rounded-r-[8px] py-3"
            >
              +
            </Button>
          </div>
          <Button
            className="relative h-auto bg-secondaryT-main items-center text-white text-2xl font-medium rounded-[8px] px-8 py-3"
            isLoading={isLoading}
            onClick={onClick}
          >
            ใส่ตะกร้า
          </Button>
        </div>
      </div>
    </div>
  );
}
