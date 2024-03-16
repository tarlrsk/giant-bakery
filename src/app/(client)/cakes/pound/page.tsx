import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import PoundCakeItems from "@/components/PoundCakeItemsContainer";

// ----------------------------------------------------------------------

export default function CakePoundPage() {
  return (
    <section>
      <TitleSection title="เค้กปอนด์" />
      <Suspense>
        <div className="pb-20 px-6 text-center md:text-left">
          <PoundCakeItems limitItems={4} isPoundCakePage />
        </div>
      </Suspense>
    </section>
  );
}
