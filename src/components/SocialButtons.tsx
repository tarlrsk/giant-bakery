import _ from "lodash";
import React from "react";

import { Button } from "@nextui-org/react";

import Iconify from "./icons/Iconify";

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
  isLoading?: boolean;
  onClick: () => void;
};

export default function SocialButtons({
  type,
  isLoading = false,
  onClick,
}: Props) {
  return (
    <Button
      fullWidth
      size="md"
      isLoading={isLoading}
      variant={type === "google" ? "bordered" : "flat"}
      className={SOCIAL_BUTTON_STYLES[type]}
      startContent={SOCIAL_ICONS[type]}
      spinnerPlacement="end"
      onClick={onClick}
    >
      <span>{_.capitalize(type)}</span>
    </Button>
  );
}
