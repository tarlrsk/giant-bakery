"use client";

import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import { NextUIProvider } from "@nextui-org/react";

// ----------------------------------------------------------------------

export const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

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
      <Toaster
        toastOptions={{
          className: ibm.className,
        }}
      />
    </NextUIProvider>
  );
}
