import React from "react";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: {
    slug: string;
  };
};

export default function BakeryDetail({ params }: Props) {
  const { slug } = params;
  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]">
      <ProductDetail slug={slug} />
    </div>
  );
}
