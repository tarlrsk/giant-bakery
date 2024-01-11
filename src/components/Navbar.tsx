"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Link,
  NavbarMenu,
  NavbarItem,
  NavbarBrand,
  NavbarContent,
  useDisclosure,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/react";

import AuthModal from "./AuthModal";

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { label: "เบเกอรี่", link: "/bakery" },
  { label: "เครื่องดื่ม", link: "/beverage" },
  { label: "เค้ก", link: "/cake" },
  { label: "ชุดเบรก", link: "/snackbox" },
];

// ----------------------------------------------------------------------

type Props = {
  role: "admin" | "customer";
  transparent?: boolean;
};

export default function Navbar({ role, transparent = false }: Props) {
  const pathname = usePathname();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const underlinedMotion = {
    rest: { opacity: 0, ease: "easeOut", duration: 0.15, type: "tween" },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.15,
        type: "tween",
        ease: "easeIn",
      },
    },
  };

  return (
    <NextNavbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:font-semibold",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      className={` md:py-6 ${
        transparent ? "bg-transparent" : "bg-primaryT-lighter"
      }`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Cukedoh</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {NAV_ITEMS.map((item, index) => (
          <NavbarItem
            key={index}
            isActive={pathname === item.link}
            className="relative"
          >
            <motion.div
              key={index}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <Link
                href={item.link}
                className="text-xl !font-normal text-primaryT-darker"
              >
                {item.label}
              </Link>
              <motion.div
                variants={underlinedMotion}
                className="flex h-0.5 w-full items-center absolute bottom-0 bg-primaryT-main"
              />
            </motion.div>
          </NavbarItem>
        ))}
        <NavbarItem onClick={onOpen} className="group relative">
          <motion.div initial="rest" whileHover="hover" animate="rest">
            <p className=" text-xl cursor-pointer text-primaryT-darker">
              เข้าสู่ระบบ/สมัคร
            </p>
            <motion.div
              variants={underlinedMotion}
              className="flex h-0.5 w-full items-center absolute bottom-0 bg-primaryT-main"
            />
          </motion.div>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {NAV_ITEMS.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className="w-full"
              href={item.link}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </NextNavbar>
  );
}
