import React from "react";
import Image from "next/image";

export default function Wave() {
  return (
    <div className="absolute left-0 top-0 h-full w-full">
      <Image
        src="/curve.svg"
        alt="curve"
        width={5000}
        height={100}
        sizes="100vw"
        className="z-0 h-auto w-full"
      />
    </div>
  );
}
