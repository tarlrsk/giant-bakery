import React, { Suspense } from "react";
import BakeryTab from "@/components/BakeryTab";
import TitleSection from "@/components/TitleSection";

export default function BakeryPage() {
  return (
    <section>
      <TitleSection title={"เบเกอรี่"} />
      <Suspense>
        <div className="relative flex flex-col justify-center items-center">
          <BakeryTab />
        </div>
      </Suspense>
    </section>
  );
}
