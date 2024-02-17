/* eslint-disable react/jsx-no-comment-textnodes */
import * as React from "react";
import type { Metadata } from "next";

// ----------------------------------------------------------------------

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
  return (
    <html lang="th">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body
        style={{ marginLeft: 0, marginRight: 0 }}
        className=" text-primaryT-darker"
      >
        {children}
      </body>
    </html>
  );
}
