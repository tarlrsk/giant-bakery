import React from "react";
import TitleSection from "@/components/TitleSection";
import BeverageItems from "@/components/BeverageItems";

export default function BeveragePage() {
  return (
    <section>
      <TitleSection title={"เครื่องดื่ม"} />
      <BeverageItems />
    </section>
  );
}
