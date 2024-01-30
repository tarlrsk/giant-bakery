import React from "react";
import type { SVGProps } from "react";

export function QRCodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 7q-.425 0-.712-.288T2 6V3q0-.425.288-.712T3 2h3q.425 0 .713.288T7 3q0 .425-.288.713T6 4H4v2q0 .425-.288.713T3 7m0 15q-.425 0-.712-.288T2 21v-3q0-.425.288-.712T3 17q.425 0 .713.288T4 18v2h2q.425 0 .713.288T7 21q0 .425-.288.713T6 22zm15 0q-.425 0-.712-.288T17 21q0-.425.288-.712T18 20h2v-2q0-.425.288-.712T21 17q.425 0 .713.288T22 18v3q0 .425-.288.713T21 22zm3-15q-.425 0-.712-.288T20 6V4h-2q-.425 0-.712-.288T17 3q0-.425.288-.712T18 2h3q.425 0 .713.288T22 3v3q0 .425-.288.713T21 7m-3.5 12v-1.5H19V19zm0-3v-1.5H19V16zM16 17.5V16h1.5v1.5zM14.5 19v-1.5H16V19zM13 17.5V16h1.5v1.5zm3-3V13h1.5v1.5zM14.5 16v-1.5H16V16zM13 14.5V13h1.5v1.5zm1-3.5q-.425 0-.712-.288T13 10V6q0-.425.288-.712T14 5h4q.425 0 .713.288T19 6v4q0 .425-.288.713T18 11zm-8 8q-.425 0-.712-.288T5 18v-4q0-.425.288-.712T6 13h4q.425 0 .713.288T11 14v4q0 .425-.288.713T10 19zm0-8q-.425 0-.712-.288T5 10V6q0-.425.288-.712T6 5h4q.425 0 .713.288T11 6v4q0 .425-.288.713T10 11zm.5 6.5h3v-3h-3zm0-8h3v-3h-3zm8 0h3v-3h-3z"
      ></path>
    </svg>
  );
}