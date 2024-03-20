"use client";

import { signIn } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import getCurrentUser from "@/actions/userActions";
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
  const [currentUser, setCurrentUser] = useState<any>();

  // Force guest to login first to get csrf token for cart usage
  useEffect(() => {
    async function getUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (currentUser?.id === "" && currentUser?.role === "GUEST") {
      signIn("credentials", { redirect: false });
    }
  }, [currentUser]);

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
