"use client";

import React, { useState } from "react";
import { Box, Card, Stack, Skeleton, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function AdminSidebarCard() {
  const orderData = [
    { label: "Orders Today", value: 254 },
    { label: "Pending Orders", value: 9 },
    { label: "Delivered Orders", value: 125 },
    { label: "Cancelled Orders", value: 20 },
  ];

  const [isLoading, setIsLoading] = useState(true);

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
