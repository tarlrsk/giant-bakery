import * as React from "react";

// ----------------------------------------------------------------------

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex flex-col h-screen justify-between">
      <main>{children}</main>
    </div>
  );
}
