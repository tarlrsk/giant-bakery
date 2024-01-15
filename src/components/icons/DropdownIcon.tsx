import * as React from "react";
import { SVGProps } from "react";

// ----------------------------------------------------------------------

const DropdownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="m7 10l5 5l5-5z" />
  </svg>
);
export default DropdownIcon;
