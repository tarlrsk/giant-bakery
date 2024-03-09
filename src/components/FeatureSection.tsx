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
    <div
      className={`flex max-w-2xl flex-col items-center justify-center gap-4 md:items-start md:gap-6`}
    >
      <div className="relative flex flex-col items-center justify-center gap-2 md:items-start md:gap-4">
        {hasTag === true && (
          <p className="text-xl font-semibold leading-normal text-secondaryT-main md:text-2xl">
            {tag ?? "คุเคะโด"}
          </p>
        )}
        <h1 className="relative text-4xl font-semibold !leading-snug text-black md:text-5xl">
          {title}
        </h1>
      </div>
      <p className="relative text-center text-xl font-normal leading-relaxed text-black md:text-left">
        {desc}
      </p>
      <Button className=" relative h-12 w-36 rounded-full bg-secondaryT-main text-lg font-semibold text-white md:text-xl">
        {btnLabel}
      </Button>
    </div>
  );
}
