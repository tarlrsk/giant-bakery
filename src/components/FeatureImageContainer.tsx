import React from "react";
import Image from "next/image";

type Props = {
  img1: string;
  img2: string;
};

export default function FeatureImageContainer({ img1, img2 }: Props) {
  return (
    <div className="w-[453px] h-[427px]">
      <div className="relative w-[453px] h-[427px] top-0 left-0">
        <div className="relative h-[427px]">
          <div className="absolute w-[292px] h-[334px] top-[45px] left-[70px] bg-primaryT-light border-[17px] border-solid border-primaryT-lighter" />
          <Image
            src={img1}
            alt="feature image"
            width={216}
            height={279}
            className="absolute w-[216px] h-[279px] top-0 left-0 bg-primaryT-darker"
          />
          <Image
            src={img2}
            alt="feature image"
            width={216}
            height={279}
            className="absolute w-[216px] h-[279px] top-[148px] left-[237px] bg-primaryT-darker"
          />
        </div>
      </div>
    </div>
  );
}
