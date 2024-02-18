import React from "react";
import TitleSection from "@/components/TitleSection";
import CustomSnackBox from "@/components/custom-snack-box/CustomSnackBox";
import SnackBoxPaginationContainer from "@/components/SnackBoxPaginationContainer";

// ----------------------------------------------------------------------

export default function SnackBoxPage() {
  return (
    <section>
      <TitleSection title={"ชุดเบรก"} />
      <div className="pb-20">
        <SnackBoxPaginationContainer />
      </div>
      <div className="pb-20">
        <CustomSnackBox />
      </div>
    </section>
  );
}
