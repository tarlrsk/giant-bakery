import * as React from "react";
import type { Metadata } from "next";
import getCurrentUser from "@/actions/userActions";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import MUIProviders from "./providers";
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
  const currentUser = await getCurrentUser();
  return (
    <MUIProviders>
      <ClientProviders>
        <div
          className={`${ibm.className} flex flex-col h-screen justify-between`}
        >
          <main>{children}</main>
        </div>
      </ClientProviders>
    </MUIProviders>
  );
}
