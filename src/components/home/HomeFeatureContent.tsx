"use client";
import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

import { Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

const animationVariants: Variants = {
  offscreen: {
    y: 300,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 2,
    },
  },
};

type Props = {
  title: string;
  desc: string;
  btnLabel: string;
  align: "left" | "right";
  className?: string;
};

type FeatureContentProps = Omit<Props, "align">;

// ----------------------------------------------------------------------

export default function HomeFeatureContent({
  title,
  desc,
  btnLabel,
  align,
  className,
}: Props) {
  const alignmentClassNames =
    align === "left"
      ? `relative w-full flex flex-col-reverse md:flex-row items-center justify-center  md:justify-between ${className}`
      : `relative w-full flex flex-col-reverse md:flex-row-reverse items-center justify-center md:justify-between ${className}`;

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true }}
    >
      <motion.div variants={animationVariants}>
        <div className={alignmentClassNames}>
          <FeatureContent title={title} desc={desc} btnLabel={btnLabel} />

          <Image
            className=" h-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
            src="/home-page-snack.png"
            width={100}
            height={100}
            alt="cake"
            style={{
              width: "auto",
              height: "100%",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------

function FeatureContent({ title, desc, btnLabel }: FeatureContentProps) {
  return (
    <div
      className={`flex max-w-2xl flex-col items-center justify-center gap-4 md:items-start md:gap-6`}
    >
      <div className="relative flex flex-col items-center justify-center gap-2 md:items-start md:gap-4">
        <p className="text-xl font-semibold leading-normal text-secondaryT-main md:text-2xl">
          คุเคะโด
        </p>
        <h1 className="relative text-4xl font-semibold !leading-snug text-black md:text-5xl">
          {title}
        </h1>
      </div>
      <p className="relative text-center text-xl font-normal leading-relaxed text-black md:text-left">
        {desc}
      </p>
      <Button className=" relative h-12 w-36 rounded-full bg-secondaryT-main text-lg font-semibold text-white md:text-xl">
        {btnLabel}
      </Button>
    </div>
  );
}
