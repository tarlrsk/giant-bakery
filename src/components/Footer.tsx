"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import Iconify from "./icons/Iconify";
import MapContainer from "./MapContainer";

// ----------------------------------------------------------------------

const FOOTER_ICONS = {
  facebook: (
    <Link
      href="https://www.wongnai.com/restaurants/416173YT-%E0%B9%83%E0%B8%88%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B9%8C%E0%B9%80%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B8%AD%E0%B8%A3%E0%B8%B5%E0%B9%88-%E0%B8%96%E0%B8%99%E0%B8%99%E0%B8%A8%E0%B8%B9%E0%B8%99%E0%B8%A2%E0%B9%8C%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%A2-4"
      target="_blank"
    >
      <Image
        src="/wongnai-icon.png"
        alt="wong nai icon"
        width={32}
        height={32}
      />
    </Link>
  ),
  instagram: (
    <Link
      href="https://www.instagram.com/cukedoh_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      target="_blank"
    >
      <Iconify
        icon="skill-icons:instagram"
        size={32}
        className="text-common-white"
      />
    </Link>
  ),
  line: (
    <Link
      href="https://www.instagram.com/cukedoh_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      target="_blank"
    >
      <Iconify
        icon="mingcute:line-app-line"
        size={32}
        className="text-common-white"
      />
    </Link>
  ),
  telephone: <Iconify icon="bi:telephone-fill" className="text-common-white" />,
};

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-10 bg-primaryT-darker px-10 py-8 md:flex-row md:gap-16 md:px-24">
      <div className="relative inline-flex flex-col items-center gap-2">
        <Image src="/logo-white.png" width={250} height={64} alt="logo" />
        <div className="relative inline-flex flex-[0_0_auto] items-start gap-6">
          {FOOTER_ICONS["facebook"]}
          {FOOTER_ICONS["instagram"]}
          {/* {FOOTER_ICONS["line"]} */}
        </div>
      </div>
      <div className="relative inline-flex flex-col items-center gap-2 md:items-start">
        <div className="relative mt-[-1.00px] self-stretch text-center text-2xl font-semibold leading-normal tracking-normal text-common-white md:text-left md:text-3xl">
          ติดต่อเรา
        </div>
        <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-3 md:items-start">
          <p className=" relative mt-[-1.00px] w-fit text-center text-lg font-normal leading-relaxed tracking-normal text-common-white md:text-left md:text-xl">
            เลขที่ 53/55 ซอยศูนย์การค้าสาย 4 ถนนสุขุมวิท, เมืองระยอง, ระยอง
            21000 <br />
            (เปิดทุกวัน เวลา 9:00 - 21:00 น.)
          </p>
          <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-3">
            {FOOTER_ICONS["telephone"]}
            <div className="relative mt-[-1.00px] w-fit text-center text-lg leading-normal tracking-normal text-common-white md:text-xl">
              038-618-125
            </div>
          </div>
        </div>
      </div>
      <MapContainer />
    </div>
  );
}
