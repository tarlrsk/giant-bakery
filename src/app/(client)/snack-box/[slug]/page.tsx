import React from "react";

type Props = {
  params: {
    slug: string;
  };
};

export default function SnackBoxDetail({ params }: Props) {
  const { slug } = params;
  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]"></div>
  );
}
