import React from "react";
import TitleSection from "@/components/TitleSection";

export default function BakeryPage() {
  return (
    <section>
      <TitleSection title={"เบเกอรี่"} />
      <div className="relative flex flex-col justify-center items-center">
        <div className="relative flex gap-5">
          <p>1</p>
          <p>2</p>
          <p>3</p>
        </div>
      </div>
    </section>
  );
}
