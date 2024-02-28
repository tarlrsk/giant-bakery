import * as React from "react";
import type { Metadata } from "next";

import MUIProviders from "./providers";

// ----------------------------------------------------------------------

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
  return (
    <MUIProviders>
      <main>{children}</main>
    </MUIProviders>
  );
}
