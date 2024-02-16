"use client";

import { Toaster } from "react-hot-toast";
import { createTheme, ThemeProvider } from "@mui/material";

// ----------------------------------------------------------------------

interface ExtendedPaletteColorOptions {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  "100"?: string;
  "200"?: string;
  "300"?: string;
  "400"?: string;
  "500"?: string;
  "600"?: string;
  "700"?: string;
  "800"?: string;
  "900"?: string;
  contrastText: string;
}

declare module "@mui/material/styles" {
  interface PaletteColorOptions extends ExtendedPaletteColorOptions {}
}

// ----------------------------------------------------------------------

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans Thai", "Roboto"].join(","),
  },
  palette: {
    primary: {
      lighter: "#fcf3d8",
      light: "#eb9624",
      main: "#eb9624",
      dark: "#dc7b1a",
      darker: "#b76017",
      contrastText: "#FFFFFF",
      "100": "#fcf3d8",
      "200": "#f9e3af",
      "300": "#f5cd7c",
      "400": "#f1b75c",
      "500": "#eb9624",
      "600": "#dc7b1a",
      "700": "#b76017",
      "800": "#924b1a",
      "900": "#753f19",
    },
    background: {
      default: "#fcf3d8",
    },
  },
});

// ----------------------------------------------------------------------

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
