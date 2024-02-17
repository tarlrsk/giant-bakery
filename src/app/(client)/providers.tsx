"use client";

import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { NextUIProvider } from "@nextui-org/react";

// ----------------------------------------------------------------------

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      {children}
      <Toaster />
    </NextUIProvider>
  );
}
