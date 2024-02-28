import React from "react";

import { Button } from "@nextui-org/react";

type Props = {
  hasTag?: boolean;
  tag?: string;
  title: string;
  desc: string;
  btnLabel: string;
};

export default function FeatureSection({
  hasTag = true,
  tag,
  title,
  desc,
  btnLabel,
}: Props) {
  return (
    <div className=" flex flex-col items-start justify-center gap-6 max-w-2xl">
      <div className="flex flex-col items-start justify-center relative">
        {hasTag === true ? (
          <p className="text-secondaryT-main text-2xl font-semibold leading-normal">
            {tag ?? "คุเคะโด"}
          </p>
        ) : (
          <></>
        )}
        <h1 className="text-black text-5xl relative font-semibold leading-normal">
          {title}
        </h1>
      </div>
      <p className="relative font-normal text-black text-xl">{desc}</p>
      <Button className="w-36 h-12 bg-secondaryT-main text-white text-xl font-semibold rounded-full relative">
        {btnLabel}
      </Button>
    </div>
  );
}
