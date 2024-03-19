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
    <div className="relative flex flex-col items-center justify-center gap-10 text-center md:flex-row md:gap-36 md:text-left">
      <div className=" relative h-72 w-72 md:h-96 md:w-96">
        <Image
          src={(item?.image as string) ?? "/placeholder.svg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>

      <div className="relative flex w-auto flex-col gap-8">
        <div className="relative flex flex-col gap-4 md:gap-5">
          <div className="relative flex flex-col gap-4">
            <h1 className=" text-3xl font-semibold leading-normal md:text-4xl">
              {item?.name}
            </h1>
            {item?.description && (
              <p className=" text-lg font-normal md:text-xl">
                {item?.description}
              </p>
            )}
          </div>
          <div className="relative flex justify-center gap-4 md:justify-start md:gap-6">
            <div className="relative flex gap-2">
              <h2 className=" text-lg font-medium md:text-xl">น้ำหนัก:</h2>
              <p className=" text-lg font-normal md:text-xl">
                {item?.weight} กรัม
              </p>
            </div>
            <div className="relative flex gap-2">
              <h2 className="text-xl font-medium">ปริมาณ:</h2>
              <p className="text-xl font-normal">
                1{/* {item?.unitRatio ? item?.unitRatio : "-"}{" "}*/}
                {item?.unitType ? item?.unitType : ""}
              </p>
            </div>
          </div>
          <div className=" text-3xl font-semibold leading-normal text-secondaryT-main md:text-4xl">
            {item?.price?.toFixed(0) ?? 0} บาท
          </div>
        </div>

        <div className="relative flex gap-10">
          <div className="relative flex rounded-sm border-1 border-black">
            <Button
              onClick={onDecrement}
              className="relative h-auto items-center rounded-l-sm bg-opacity-0 py-3 text-2xl font-medium text-black"
            >
              -
            </Button>
            <input
              type="text"
              value={counter}
              onChange={onChange}
              size={counter.toString().length}
              className="relative h-auto items-center bg-opacity-0 py-3 text-center text-2xl font-medium text-black"
            />
            <Button
              onClick={onIncrement}
              className="relative h-auto items-center rounded-r-sm bg-opacity-0 py-3 text-2xl font-medium text-black"
            >
              +
            </Button>
          </div>
          <Button
            size="lg"
            className="relative h-auto items-center rounded-sm bg-secondaryT-main text-lg font-medium text-white md:text-xl"
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
