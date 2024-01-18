import React from "react";

import { Image } from "@nextui-org/react";

export default function Wave() {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Image
        src={"curve.svg"}
        alt="curve"
        width={"100%"}
        height={"100vh"}
        className="z-0"
      />
    </div>
  );
}
