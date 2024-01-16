import React from "react";

import { Image } from "@nextui-org/react";

export default function Wave() {
  return (
    <div className="absolute top-0">
      <Image
        src={"curve.svg"}
        alt="curve"
        width={1800}
        height={100}
        className="z-0"
      />
    </div>
  );
}
