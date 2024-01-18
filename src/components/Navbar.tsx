"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

import {
  Link,
  Button,
  Divider,
  Dropdown,
  NavbarMenu,
  NavbarItem,
  NavbarBrand,
  DropdownMenu,
  DropdownItem,
  NavbarContent,
  useDisclosure,
  NavbarMenuItem,
  DropdownTrigger,
  DropdownSection,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/react";

import AuthModal from "./modal/AuthModal";
import BasketIcon from "./icons/BasketIcon";
import DropdownIcon from "./icons/DropdownIcon";

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  { label: "เบเกอรี่", link: "/bakery" },
  { label: "เครื่องดื่ม", link: "/beverage" },
  { label: "เค้ก", link: "/cake" },
  { label: "ชุดเบรก", link: "/snack-box" },
];

// ----------------------------------------------------------------------

type Props = {
  currentUser: User | null;
  transparent?: boolean;
  hasShadow?: boolean;
};

export default function Navbar({
  currentUser,
  transparent = false,
  hasShadow = false,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { onSignOut } = useAuth();
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
      maxWidth="2xl"
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
      className={`md:py-8 ${
        transparent ? "bg-transparent" : "bg-primaryT-lighter"
      } ${hasShadow ? "shadow-lg" : ""}`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image
            src="/logo.png"
            width={200}
            height={64}
            alt="logo"
            onClick={() => router.push("/")}
            className=" cursor-pointer"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-14" justify="center">
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
        <div className=" flex flex-row items-center h-full gap-8 justify-between">
          <NavbarItem className="group relative">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              onClick={onOpen}
            >
              {currentUser ? (
                <Dropdown className=" rounded-md min-w-40">
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className="text-xl bg-transparent hover:!bg-transparent aria-expanded:!opacity-85 px-0"
                      disableRipple
                      endContent={<DropdownIcon width={32} height={32} />}
                    >
                      บัญชีของฉัน
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Static Actions"
                    variant="flat"
                    className="pb-0"
                  >
                    <DropdownSection showDivider>
                      <DropdownItem key="new" className=" rounded-sm ">
                        <p className=" text-base">ออเดอร์</p>
                      </DropdownItem>
                      <DropdownItem key="copy" className=" rounded-sm ">
                        <p className=" text-base">ประวัติการสั่งซื้อ</p>
                      </DropdownItem>
                    </DropdownSection>

                    <DropdownSection>
                      <DropdownItem
                        key="delete"
                        className="text-danger  rounded-sm "
                        color="danger"
                        onClick={() => onSignOut()}
                      >
                        <p className=" text-base">ออกจากระบบ</p>
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <p
                  className=" text-xl cursor-pointer text-primaryT-darker"
                  onClick={onOpen}
                >
                  เข้าสู่ระบบ/สมัคร
                </p>
              )}
              <motion.div
                variants={underlinedMotion}
                className="flex h-0.5 w-full items-center absolute bottom-0 bg-primaryT-main"
              />
            </motion.div>
          </NavbarItem>

          <Divider
            orientation="vertical"
            className=" h-2/3 bg-primaryT-darker w-0.25"
          />
          <Button isIconOnly size="lg" className="bg-transparent rounded-full">
            <BasketIcon width={32} height={32} />
          </Button>
        </div>
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

// ----------------------------------------------------------------------
