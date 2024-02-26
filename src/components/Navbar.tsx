"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

import {
  Link,
  Badge,
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
  { label: "เบเกอรี่", link: "/bakeries?category=" },
  { label: "เครื่องดื่ม", link: "/beverages" },
  { label: "เค้ก", link: "/cakes" },
  { label: "ชุดเบรก", link: "/snack-boxes" },
];

// ----------------------------------------------------------------------

type Props = {
  currentUser: User | any;
  cart: { quantity: number }[];
  transparent?: boolean;
  hasShadow?: boolean;
};

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

export default function Navbar({
  currentUser,
  cart,
  transparent = false,
  hasShadow = false,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { onSignOut } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsAmount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
            className=" w-24 ml-2 md:w-52 md:ml-0 cursor-pointer"
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
        <div className="flex flex-row items-center h-full gap-8 justify-between">
          <NavbarItem className="group relative">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              // onClick={onOpen}
            >
              {currentUser?.role !== "GUEST" ? (
                <Dropdown className="rounded-md min-w-40">
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
                        <p
                          className=" text-base"
                          onClick={() => {
                            router.push("/orders");
                          }}
                        >
                          ออเดอร์
                        </p>
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
          <Badge
            content={cartItemsAmount}
            isInvisible={cartItemsAmount === 0}
            color="primary"
            showOutline={false}
            placement="bottom-right"
            className=" mb-1.5 mr-1.5"
          >
            <Button
              onClick={() => {
                router.push("/cart");
              }}
              isIconOnly
              size="lg"
              className="bg-transparent rounded-full"
            >
              <BasketIcon width={40} height={40} />
            </Button>
          </Badge>
        </div>
      </NavbarContent>

      <NavbarMenu>
        <div className="relative flex flex-col gap-8 my-5">
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
          <div className="flex flex-row items-center gap-8 justify-between">
            <NavbarItem className="group relative">
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                // onClick={onOpen}
              >
                {currentUser?.role !== "GUEST" ? (
                  <Dropdown className="rounded-md min-w-full">
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
          </div>
        </div>
      </NavbarMenu>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </NextNavbar>
  );
}

// ----------------------------------------------------------------------
