"use client";

import { useTheme, ThemeProvider } from "@mui/material";

// ----------------------------------------------------------------------

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
