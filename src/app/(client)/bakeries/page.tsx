import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import BakeryTabItems from "@/components/BakeryTabItems";

// ----------------------------------------------------------------------

export default function BakeryPage() {
  return (
    <section>
      <TitleSection title={"เบเกอรี่"} />
      <Suspense>
        <div className="relative flex flex-col justify-center items-center">
          <BakeryTabItems />
        </div>
      </Suspense>
    </section>
  );
}
