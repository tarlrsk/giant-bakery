import React from "react";
import Image from "next/image";
import { SnackBox } from "@prisma/client";

import { Button } from "@nextui-org/react";

type Props = {
  item: SnackBox;
  counter: number;
  isLoading: boolean | undefined;
  onClick: (item: any) => void;
  onChange: (e: any) => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function SnackBoxDetail({
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
        src={(item?.image as string) ? (item?.image as string) : ""}
        alt={item?.name}
        width={420}
        height={420}
      />

      <div className="relative flex w-auto flex-col gap-8">
        <div className="relative flex flex-col gap-4">
          <div className="relative flex flex-col gap-5">
            <h1 className="text-4xl font-semibold leading-normal">
              {item?.name}
            </h1>
            <p className="text-xl font-normal">{item?.description}</p>
          </div>
          <div className="relative flex gap-6">
            <div className="relative flex gap-2">
              <h2 className="text-xl font-semibold">น้ำหนัก:</h2>
              <p className="text-xl font-normal">{item?.weight}</p>
            </div>
            <div className="relative flex gap-2">
              <h2 className="text-xl font-semibold">ประกอบด้วย:</h2>
              <p className="text-xl font-normal"></p>
            </div>
          </div>
          <div className="text-4xl font-semibold leading-normal">
            ฿{item?.price?.toFixed(0) ?? 0}
          </div>
        </div>

        <div className="relative flex gap-10">
          <div className="relative flex rounded-[8px] border-1 border-black">
            <Button
              onClick={onDecrement}
              className="relative h-auto items-center rounded-l-[8px] bg-opacity-0 py-3 text-2xl font-medium text-black"
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
              className="relative h-auto items-center rounded-r-[8px] bg-opacity-0 py-3 text-2xl font-medium text-black"
            >
              +
            </Button>
          </div>
          <Button
            className="relative h-auto items-center rounded-[8px] bg-secondaryT-main px-8 py-3 text-2xl font-medium text-white"
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
