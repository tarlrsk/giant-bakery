import React from "react";

import { Button } from "@nextui-org/react";

type Props = {
  tag?: string;
  title: string;
  desc: string;
  btnLabel: string;
};

export default function FeatureSection({ tag, title, desc, btnLabel }: Props) {
  return (
    <section>
      <div className="relative">
        <div className="flex flex-col w-1/3 items-start justify-center gap-6 relative">
          <div className="flex flex-col items-start justify-center relative">
            <p className="text-secondaryT-main text-xl font-semibold leading-normal">
              {tag ?? "คุเคะโด"}
            </p>
            <h3 className="mt-[-8px] text-black text-5xl relative font-semibold leading-normal">
              {title}
            </h3>
          </div>
          <p className="relative font-normal text-black text-xl">{desc}</p>
          <Button className="w-32 h-10 bg-secondaryT-main text-white text-base font-semibold rounded-full relative">
            {btnLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
