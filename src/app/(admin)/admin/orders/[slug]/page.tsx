"use client";

import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, width: 1 }}
      >
        <Typography variant="h5" fontWeight={400}>
          ข้อมูลออเดอร์
        </Typography>
      </Stack>
      <Paper
        elevation={0}
        sx={{
          py: 4,
          px: 6,
          border: 1,
          borderColor: "black",
          background: "transparent",
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">เลขออเดอร์</Typography>
            <Typography fontWeight={500}>100004</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">วันที่สั่งออเดอร์</Typography>
            <Typography fontWeight={500}>13/11/2566</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">สถานะออเดอร์</Typography>
            <Typography fontWeight={500}>รอยืนยันออเดอร์</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">ประเภทการชำระ</Typography>
            <Typography fontWeight={500}>จ่ายมัดจำ</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">ตัวเลือกการชำระเงิน</Typography>
            <Typography fontWeight={500}>เครดิตการ์ด</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.700">เป็นจำนวนเงิน</Typography>
            <Typography fontWeight={500}>฿ 1,846</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
