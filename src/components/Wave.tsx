import React from "react";
import Image from "next/image";

export default function Wave() {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Image
        src={"curve.svg"}
        alt="curve"
        width={5000}
        height={100}
        className="z-0"
      />
    </div>
  );
}
