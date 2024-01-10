import _ from "lodash";
import React from "react";

import { Button } from "@nextui-org/react";

import Iconify from "./Iconify";

// ----------------------------------------------------------------------

const SOCIAL_BUTTON_STYLES = {
  facebook: "bg-facebook-main text-common-white",
  google: "bg-common-white text-common-black",
};

const SOCIAL_ICONS = {
  facebook: (
    <Iconify
      icon="ic:baseline-facebook"
      size={24}
      className=" text-common-white"
    />
  ),
  google: <Iconify icon="devicon:google" />,
};

// ----------------------------------------------------------------------

type Props = {
  type: "facebook" | "google";
  onClick: () => void;
};

export default function SocialButtons({ type, onClick }: Props) {
  return (
    <Button
      fullWidth
      size="md"
      variant={type === "google" ? "bordered" : "flat"}
      className={SOCIAL_BUTTON_STYLES[type]}
      startContent={SOCIAL_ICONS[type]}
      onClick={onClick}
    >
      <span>{_.capitalize(type)}</span>
    </Button>
  );
}
