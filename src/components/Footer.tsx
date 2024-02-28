"use client";

import React from "react";
import Image from "next/image";

import Iconify from "./icons/Iconify";
import MapContainer from "./MapContainer";

const FOOTER_ICONS = {
  facebook: (
    <Iconify
      icon="ic:baseline-facebook"
      size={32}
      className=" text-common-white"
    />
  ),
  instagram: (
    <Iconify icon="iconoir:instagram" size={32} className="text-common-white" />
  ),
  line: (
    <Iconify
      icon="mingcute:line-app-line"
      size={32}
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
        <div className="self-stretch font-semibold text-3xl leading-normal relative mt-[-1.00px] text-common-white tracking-normal">
          ติดต่อเรา
        </div>
        <div className="flex-col items-start gap-3 inline-flex relative flex-[0_0_auto]">
          <p className="w-fit font-normal text-xl leading-9 relative mt-[-1.00px] text-common-white tracking-normal">
            เลขที่ 53/55 ซอยศูนย์การค้าสาย 4 ถนนสุขุมวิท, เมืองระยอง, ระยอง
            21000 <br />
            (เปิดทุกวัน เวลา 9:00 - 21:00 น.)
          </p>
          <div className="items-center justify-center gap-3 inline-flex relative flex-[0_0_auto]">
            {FOOTER_ICONS["telephone"]}
            <div className="relative w-fit mt-[-1.00px] font-medium text-common-white text-xl text-center tracking-normal leading-normal">
              038-618-125
            </div>
          </div>
        </div>
      </div>
      <MapContainer />
    </div>
  );
}
