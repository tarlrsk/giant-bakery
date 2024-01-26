"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@nextui-org/react";

type Props = {
  slug: string;
};

export default function ProductDetail({ slug }: Props) {
  const [counter, setCounter] = useState(1);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue =
      isNaN(inputValue) || inputValue === "" ? 1 : parseInt(inputValue, 10);
    inputValue = Math.min(Math.max(inputValue, 1), 999);
    setCounter(inputValue);
  };

  const decrement = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  const increment = () => {
    setCounter(counter + 1);
  };

  const encodedSlug = decodeURIComponent(slug);

  return (
    <div className="relative flex items-center justify-center gap-36">
      <Image src="/cake-1.svg" alt="cake" width={420} height={420} />

      <div className="relative flex flex-col w-auto gap-8">
        <div className="relative flex flex-col gap-4">
          <div className="relative flex flex-col gap-5">
            <h1 className="font-semibold text-4xl leading-normal">
              {encodedSlug}
            </h1>
            <p className="font-normal text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="relative flex gap-6">
            <div className="relative flex gap-2">
              <h2 className="font-semibold text-xl">น้ำหนัก:</h2>
              <p className="font-normal text-xl">10 กก</p>
            </div>
            <div className="relative flex gap-2">
              <h2 className="font-semibold text-xl">ปริมาณ:</h2>
              <p className="font-normal text-xl">20 ชิ้น</p>
            </div>
          </div>
          <div className="relative flex gap-2">
            <h2 className="font-semibold text-xl">มีส่วนผสมของ:</h2>
            <p className="font-normal text-xl">ถั่ว แป้ง</p>
          </div>
          <div className="font-semibold text-4xl leading-normal">฿49.-</div>
        </div>

        <div className="relative flex gap-10">
          <div className="relative flex border-1 rounded-[8px] border-black">
            <Button
              onClick={decrement}
              className="relative h-auto items-center bg-opacity-0 text-black text-2xl font-medium rounded-l-[8px] py-3"
            >
              -
            </Button>
            <input
              type="text"
              value={counter}
              onChange={handleInputChange}
              size={counter.toString().length}
              className="relative h-auto items-center bg-opacity-0 text-center text-black text-2xl font-medium py-3"
            />
            <Button
              onClick={increment}
              className="relative h-auto items-center bg-opacity-0 text-black text-2xl font-medium rounded-r-[8px] py-3"
            >
              +
            </Button>
          </div>
          <Button className="relative h-auto bg-secondaryT-main items-center text-white text-2xl font-medium rounded-[8px] px-8 py-3">
            ใส่ตะกร้า
          </Button>
        </div>
      </div>
    </div>
  );
}
