import React from "react";
import type { SVGProps } from "react";

export function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 2C0 .9.9 0 2 0h16a2 2 0 0 1 2 2v2H0zm1 3h18v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm6 2v2h6V7z"
      ></path>
    </svg>
  );
}
