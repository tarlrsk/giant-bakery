import React from "react";

import Wave from "./Wave";

type Props = {
  title: string;
};

export default async function TitleSection({ title }: Props) {
  return (
    <div>
      <Wave />
      <div className=" relative flex flex-col justify-center items-center py-20 md:py-48 gap-4">
        <h1 className=" text-7xl md:text-8xl font-bold text-center text-primaryT-darker leading-normal">
          {title}
        </h1>
        <p className=" text-4xl md:text-5xl font-semibold text-center text-primaryT-dark opacity-50">
          CUKEDOH BAKERY
        </p>
      </div>
    </div>
  );
}
