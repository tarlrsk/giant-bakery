import * as React from "react";
import type { Metadata } from "next";
import apiPaths from "@/utils/api-path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import getCurrentUser from "@/actions/userActions";
import { permanentRedirect } from "next/navigation";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import "./globals.css";
import ClientProviders from "./providers";

// ----------------------------------------------------------------------

const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  title: "Cukedoh",
  description: "E-commerce web application for Giant Bakery Rayong, Thailand.",
};

// ----------------------------------------------------------------------

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getCart } = apiPaths();
  const currentUser = await getCurrentUser();
  const cartData = await fetch(getCart(currentUser?.id || ""), {
    next: { tags: ["cart"] },
    cache: "no-store",
  }).then(async (res) => {
    const data = await res.json();
    if (!data?.response?.success) return null;
    return data;
  });

  if (currentUser?.role === "ADMIN") {
    permanentRedirect(`/admin/orders`); // Navigate to admin page
  }

  const cart = cartData?.response?.data?.items || [];
  return (
    <ClientProviders>
      <div
        className={`${ibm.className} flex h-screen flex-col justify-between`}
      >
        <Navbar currentUser={currentUser} cart={cart} hasShadow={true} />
        <main>{children}</main>
        <Footer />
      </div>
    </ClientProviders>
  );
}
