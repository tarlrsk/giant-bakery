import React from "react";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

type Props = {
  icon: string | any;
  size?: number;
  className?: string;
};

export default function Iconify({ icon, size = 20, className }: Props) {
  return <Icon icon={icon} fontSize={size} className={className} />;
}
