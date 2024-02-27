"use client";

import { Typography } from "@mui/material";
import { redirect } from "next/navigation";

// ----------------------------------------------------------------------

export default function AdminHome() {
  redirect("/admin/orders");
  return <Typography>Home</Typography>;
}
