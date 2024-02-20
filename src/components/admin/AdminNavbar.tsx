"use client";

import _ from "lodash";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";
import { useRouter, usePathname } from "next/navigation";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Box, Tab, Tabs, Stack, AppBar, Button } from "@mui/material";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BakeryDiningRoundedIcon from "@mui/icons-material/BakeryDiningRounded";
import TakeoutDiningRoundedIcon from "@mui/icons-material/TakeoutDiningRounded";

// ----------------------------------------------------------------------

const navItems = [
  { value: "admin", label: "หน้าแรก", icon: <HomeIcon />, size: "medium" },
  {
    value: "orders",
    label: "ออเดอร์",
    icon: <BookmarkRoundedIcon />,
    size: "medium",
  },

  {
    value: "products",
    label: "สินค้า",
    icon: <BakeryDiningRoundedIcon />,
    size: "medium",
  },
  {
    value: "cakes",
    label: "เค้ก",
    icon: <TakeoutDiningRoundedIcon />,
    size: "medium",
  },
  {
    value: "snack-boxes",
    label: "ชุดเบรก",
    icon: <Inventory2Icon />,
    size: "medium",
  },
  {
    value: "variants",
    label: "ตัวเลือกเค้ก",
    icon: <LayersIcon />,
    size: "medium",
  },
];

// ----------------------------------------------------------------------

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { onSignOut } = useAuth();
  const activeLink = _.capitalize(pathname.split("/").slice(-1)[0]);
  const [currentPage, setCurrentPage] = useState(
    activeLink === "Admin" ? "home" : activeLink.toLowerCase(),
  );

  const handleChange = (event: React.SyntheticEvent, page: string) => {
    setCurrentPage(page);
    if (page === "admin") return router.push("/admin");
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        position="relative"
      >
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
                  value={item.value}
                  sx={{ py: 0, minHeight: "48px" }}
                />
              ))}
            </Tabs>
          </Box>
        </Stack>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ mr: 4, height: "36px" }}
          onClick={() => onSignOut()}
        >
          Log out
        </Button>
      </Stack>
    </AppBar>
  );
}
