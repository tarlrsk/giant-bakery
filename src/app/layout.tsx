import * as React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import getCurrentUser from "@/actions/getCurrentUser";

import "./globals.css";
import Providers from "./providers";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className={`${ibm.className} text-primaryT-darker`}>
        <Providers>
          <Navbar currentUser={currentUser} />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
