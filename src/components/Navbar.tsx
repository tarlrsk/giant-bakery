"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ibm } from "@/app/(client)/providers";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <NextNavbar
      isMenuOpen={isMenuOpen}
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
          className="md:hidden"
        />
        <NavbarBrand>
          <Image
            src="/logo.png"
            width={200}
            height={64}
            alt="logo"
            onClick={() => router.push("/")}
            className=" ml-2 w-24 cursor-pointer md:ml-0 md:w-52"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="md:hidden">
        {currentUser?.role !== "GUEST" ? (
          <Dropdown className={`min-w-40 rounded-md ${ibm.className}`}>
            <DropdownTrigger>
              <Button
                variant="light"
                className="aria-expanded:!opacity-85 bg-transparent px-0 text-base hover:!bg-transparent"
                disableRipple
                endContent={<DropdownIcon width={26} height={26} />}
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
                    className=" text-sm"
                    onClick={() => {
                      router.push("/orders");
                    }}
                  >
                    ออเดอร์
                  </p>
                </DropdownItem>
              </DropdownSection>

              <DropdownSection>
                <DropdownItem
                  key="delete"
                  className="rounded-sm text-sm  text-danger "
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
            className=" cursor-pointer text-base text-primaryT-darker"
            onClick={onOpen}
          >
            เข้าสู่ระบบ/สมัคร
          </p>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden gap-6 md:inline-flex lg:gap-14"
        justify="center"
      >
        {NAV_ITEMS.map((item, index) => (
          <NavbarItem
            key={index}
            isActive={
              pathname !== "/" &&
              (pathname.startsWith(item.link) || item.link.startsWith(pathname))
            }
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
                className="absolute bottom-0 flex h-0.5 w-full items-center bg-primaryT-main"
              />
            </motion.div>
          </NavbarItem>
        ))}
        <div className="flex h-full flex-row items-center justify-between gap-8">
          <NavbarItem className="group relative">
            <motion.div initial="rest" whileHover="hover" animate="rest">
              {currentUser?.role !== "GUEST" ? (
                <Dropdown className={`min-w-40 rounded-md ${ibm.className}`}>
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className="aria-expanded:!opacity-85 bg-transparent px-0 text-xl hover:!bg-transparent"
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
                    </DropdownSection>

                    <DropdownSection>
                      <DropdownItem
                        key="delete"
                        className="rounded-sm  text-danger "
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
                  className=" cursor-pointer text-xl text-primaryT-darker"
                  onClick={onOpen}
                >
                  เข้าสู่ระบบ/สมัคร
                </p>
              )}
              <motion.div
                variants={underlinedMotion}
                className="absolute bottom-0 flex h-0.5 w-full items-center bg-primaryT-main"
              />
            </motion.div>
          </NavbarItem>

          <Divider
            orientation="vertical"
            className=" h-2/3 w-0.25 bg-primaryT-darker"
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
              className="rounded-full bg-transparent"
            >
              <BasketIcon width={40} height={40} />
            </Button>
          </Badge>
        </div>
      </NavbarContent>

      <NavbarMenu className={ibm.className}>
        <div className="relative my-5 flex flex-col gap-8">
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
        </div>
      </NavbarMenu>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </NextNavbar>
  );
}

// ----------------------------------------------------------------------
