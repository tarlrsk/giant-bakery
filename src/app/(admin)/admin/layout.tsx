"use client";

import * as React from "react";
import { Box, Grid, Toolbar } from "@mui/material";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebarCard from "@/components/admin/AdminSidebarCard";

// ----------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box height="100vh">
      <AdminNavbar />
      <Toolbar disableGutters sx={{ minHeight: "0 !important", height: 40 }} />
      <Grid
        container
        spacing={4}
        sx={{ height: 1, pr: 4, backgroundColor: "#F5F6FA" }}
      >
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
