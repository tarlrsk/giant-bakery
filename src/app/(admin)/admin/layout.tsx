import * as React from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

// ----------------------------------------------------------------------

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex flex-col h-screen justify-between">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
