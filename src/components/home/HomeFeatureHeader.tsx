"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

import { Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

const animationVariants: Variants = {
  offscreen: {
    y: -300,
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
};

// ----------------------------------------------------------------------

export default function HomeFeatureHeader({ title, desc, btnLabel }: Props) {
  const router = useRouter();
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true }}
    >
      <div className="relative flex flex-col-reverse items-center justify-between text-center md:mt-10 md:flex-row md:text-left  2xl:mt-0">
        <div className="flex max-w-2xl flex-col items-center justify-center gap-4 md:items-start md:gap-6">
          <h1 className=" text-4xl font-semibold !leading-snug  md:text-5xl">
            {title}
          </h1>
          <p className=" text-center text-xl font-normal leading-relaxed  md:text-left">
            {desc}
          </p>
          <Button
            onClick={() => router.push("/bakeries?category=")}
            className="  h-12 w-36 rounded-full bg-secondaryT-main text-lg font-semibold text-white md:text-xl"
          >
            {btnLabel}
          </Button>
        </div>
        <motion.div variants={animationVariants}>
          <Image
            className=" h-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
            src="/home-snack.png"
            width={100}
            height={100}
            alt="cake"
            style={{
              width: "auto",
              height: "100%",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
