"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";
import { Box, Tab, Tabs, Stack, AppBar } from "@mui/material";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BakeryDiningRoundedIcon from "@mui/icons-material/BakeryDiningRounded";
import TakeoutDiningRoundedIcon from "@mui/icons-material/TakeoutDiningRounded";

// ----------------------------------------------------------------------

const navItems = [
  { label: "Home", icon: <HomeIcon /> },
  { label: "Order", icon: <BookmarkRoundedIcon /> },

  {
    label: "Product",
    icon: <BakeryDiningRoundedIcon />,
  },
  { label: "Cake", icon: <TakeoutDiningRoundedIcon /> },
  { label: "Variant", icon: <LayersIcon /> },
];

// ----------------------------------------------------------------------

export default function AdminNavbar() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("Home");

  const handleChange = (event: React.SyntheticEvent, page: string) => {
    setCurrentPage(page);
    if (page === "Home") return router.push("/admin");
    router.push(`/admin/${page.toLocaleLowerCase()}`);
  };

  return (
    <AppBar
      component="nav"
      color="default"
      sx={{
        boxShadow: 0,
        borderBottom: 0.25,
        borderColor: "divider",
      }}
    >
      <Stack direction="row" position="relative">
        <Box
          sx={{
            width: "48px",
            height: "48.5px",
            backgroundColor: "secondary.main",
            position: "absolute",
          }}
        />

        <Stack direction="row" alignItems="flex-end" ml={10}>
          <Box sx={{ height: 1 }}>
            <Tabs
              value={currentPage}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {navItems.map((item, index) => (
                <Tab
                  key={index}
                  disableRipple
                  iconPosition="start"
                  icon={item.icon}
                  label={item.label}
                  value={item.label}
                  sx={{ py: 0, minHeight: "48px" }}
                />
              ))}
            </Tabs>
          </Box>
        </Stack>
      </Stack>
    </AppBar>
  );
}
