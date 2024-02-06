import React from "react";

import Wave from "./Wave";

type Props = {
  title: string;
};

export default async function TitleSection({ title }: Props) {
  return (
    <div>
      <Wave />
      <div className="relative flex flex-col justify-center items-center pt-36 py-72">
        <h1 className="text-8xl font-bold text-center text-primaryT-darker leading-normal">
          {title}
        </h1>
        <p className="text-5xl font-semibold text-center text-primaryT-dark opacity-50">
          CUKEDOH BAKERY
        </p>
      </div>
    </div>
  );
}
