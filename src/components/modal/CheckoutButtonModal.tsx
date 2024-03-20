"use client";
import React from "react";

import { Button, useDisclosure } from "@nextui-org/react";

import AuthModal from "./AuthModal";

// ----------------------------------------------------------------------

export default function CheckoutButtonModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="secondary"
        size="lg"
        className=" mt-4 rounded-none text-lg font-medium md:text-xl"
        fullWidth
        onClick={onOpen}
      >
        ดำเนินการต่อ
      </Button>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
