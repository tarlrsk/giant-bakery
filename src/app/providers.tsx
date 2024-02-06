"use client";

import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import { NextUIProvider } from "@nextui-org/react";

// ----------------------------------------------------------------------

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
        {children}
        <Toaster />
      </NextUIProvider>
    </SessionProvider>
  );
}
