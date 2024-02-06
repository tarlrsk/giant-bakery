"use client";

import React from "react";
import Image from "next/image";

import Iconify from "./icons/Iconify";
import MapContainer from "./MapContainer";

const FOOTER_ICONS = {
  facebook: (
    <Iconify
      icon="ic:baseline-facebook"
      size={24}
      className=" text-common-white"
    />
  ),
  instagram: (
    <Iconify icon="iconoir:instagram" size={24} className="text-common-white" />
  ),
  line: (
    <Iconify
      icon="mingcute:line-app-line"
      size={24}
      className="text-common-white"
    />
  ),
  telephone: <Iconify icon="bi:telephone" className="text-common-white" />,
};

export default function Footer() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-16 px-24 py-8 relative bg-primaryT-darker">
      <div className="inline-flex flex-col items-center gap-2 relative">
        <Image src="/logo-white.png" width={250} height={64} alt="logo" />
        <div className="inline-flex items-start gap-7 relative flex-[0_0_auto]">
          {FOOTER_ICONS["facebook"]}
          {FOOTER_ICONS["instagram"]}
          {FOOTER_ICONS["line"]}
        </div>
      </div>
      <div className="inline-flex flex-col items-start relative">
        <div className="self-stretch font-semibold text-3xl leading-normal relative mt-[-1.00px] text-background-default tracking-normal">
          ติดต่อเรา
        </div>
        <div className="flex-col items-start gap-3 inline-flex relative flex-[0_0_auto]">
          <p className="w-fit font-normal text-xl leading-9 relative mt-[-1.00px] text-background-default tracking-normal">
            ที่อยู่ 299 หมู่ 4 ต. เนินพระ อ. เมือง จ. ระยอง 21000 <br />
            (เปิดทุกวัน เวลา 7:00 - 18:00 น.)
          </p>
          <div className="items-center justify-center gap-3 inline-flex relative flex-[0_0_auto]">
            {FOOTER_ICONS["telephone"]}
            <div className="relative w-fit mt-[-1.00px] font-medium text-background-default text-xl text-center tracking-normal leading-normal">
              087-xxx-xxxx, 02-xxx-xxxx
            </div>
          </div>
        </div>
      </div>
      <MapContainer />
    </div>
  );
}
