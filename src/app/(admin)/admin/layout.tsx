"use client";

import * as React from "react";
import { Box, Grid, Toolbar } from "@mui/material";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebarCard from "@/components/admin/AdminSidebarCard";

// ----------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box minHeight="100vh" sx={{ backgroundColor: "#F5F6FA" }}>
      <AdminNavbar />
      <Toolbar disableGutters sx={{ minHeight: "0 !important", height: 40 }} />
      <Grid container spacing={4} sx={{ minHeight: "100vh", pr: 4 }}>
        <Grid item xs={2}>
          <AdminSidebarCard />
        </Grid>
        <Grid item xs={10} sx={{ mt: 5 }}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
