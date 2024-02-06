import React from "react";
import Image from "next/image";

type Props = {
  img: string;
};

export default function FeatureImageContainer({ img }: Props) {
  return (
    <div className="absolute -z-10 inset-0">
      <Image
        src={img}
        alt="feature image"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
