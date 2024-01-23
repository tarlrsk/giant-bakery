import * as React from "react";
import { SVGProps } from "react";

// ----------------------------------------------------------------------

const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" {...props}>
    <path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm1 18h-2v-7h2v7zm-1-9.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 15 11.5z" />
  </svg>
);
export default InfoIcon;
