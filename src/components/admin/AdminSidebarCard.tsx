"use client";

import useSWR from "swr";
import React from "react";
import apiPaths from "@/utils/api-path";
import { adminFetcher } from "@/utils/axios";
import { Box, Card, Stack, Skeleton, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function AdminSidebarCard() {
  const { getOrdersOverview } = apiPaths();
  const { data: ordersOverviewData, isLoading } = useSWR(
    getOrdersOverview(),
    adminFetcher,
  );

  const data = ordersOverviewData?.data || null;

  const orderData = [
    { label: "Orders Today", value: data?.todayOrder || 0 },
    { label: "Pending Orders", value: data?.pendingOrder || 0 },
    { label: "Delivered Orders", value: data?.completedOrder || 0 },
    { label: "Cancelled Orders", value: data?.cancelledOrder || 0 },
  ];

  return (
    <Card
      sx={{
        height: 1,
        background: "linear-gradient(to bottom right, #eb9624, #924b1a)",
        borderTopLeftRadius: 0,
        boxShadow: 5,
      }}
    >
      <Box sx={{ m: 4, color: "white" }}>
        <Stack direction="column" spacing={5}>
          <Typography variant="body1" color="primary.200" fontWeight="600">
            Overview
          </Typography>
          {orderData.map((data) => (
            <Stack key={data.label} direction="column" spacing={1}>
              <Typography variant="body1" fontWeight="400">
                {data.label}
              </Typography>
              <Typography variant="h4" fontWeight="600">
                {isLoading ? (
                  <Skeleton animation="wave" width="50%" />
                ) : (
                  data.value
                )}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}
