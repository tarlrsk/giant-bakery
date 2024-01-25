import React from "react";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: {
    slug: string;
  };
};

export default function BakeryDetail({ params }: Props) {
  const { slug } = params;
  return <ProductDetail slug={slug} />;
}
