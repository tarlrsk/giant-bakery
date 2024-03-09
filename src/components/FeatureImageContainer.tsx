import React from "react";
import Image from "next/image";

type Props = {
  img: string;
};

export default function FeatureImageContainer({ img }: Props) {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={img}
        alt="feature image"
        width={100}
        height={100}
        sizes="100vw"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
