import * as React from "react";

import "./globals.css";
import AdminProviders from "./providers";

// ----------------------------------------------------------------------

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const currentUser = await getCurrentUser();
  return (
    <AdminProviders>
      <main>{children}</main>
    </AdminProviders>
  );
}
