"use client";

import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

import { Button, useDisclosure } from "@nextui-org/react";

// ----------------------------------------------------------------------

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="h-screen flex flex-col items-center justify-between">
      <div>
        <Button className=" bg-secondaryT-main text-white" onPress={onOpen}>
          Authentication
        </Button>
        <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
      <Footer />
    </section>
  );
}
