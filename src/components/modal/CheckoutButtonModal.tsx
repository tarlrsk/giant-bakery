"use client";
import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import AuthModal from "./AuthModal";

export default function CheckoutButtonModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="secondary"
        size="lg"
        className=" font-medium text-xl rounded-none"
        fullWidth
        onClick={onOpen}
      >
        ดำเนินการต่อ
      </Button>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
