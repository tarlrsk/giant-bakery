"use client";

import { Toaster } from "react-hot-toast";
import { createTheme, ThemeProvider } from "@mui/material";

// ----------------------------------------------------------------------

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// ----------------------------------------------------------------------

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans Thai", "Roboto"].join(","),
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      lighter: "#fcf3d8",
      light: "#f5cd7c",
      main: "#eb9624",
      dark: "#b76017",
      darker: "#753f19",
      contrastText: "#FFFFFF",
      "50": "#fefaee",
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
    secondary: {
      lighter: "#fffac2",
      light: "#ffe55a",
      main: "#ecb406",
      dark: "#a36205",
      darker: "#723f11",
      "50": "#fefce8",
      "100": "#fffac2",
      "200": "#fff189",
      "300": "#ffe55a",
      "400": "#fdce12",
      "500": "#ecb406",
      "600": "#cc8b02",
      "700": "#a36205",
      "800": "#864d0d",
      "900": "#723f11",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F6FA",
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
