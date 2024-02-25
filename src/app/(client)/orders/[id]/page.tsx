"use client";

import React from "react";
import {
  Box,
  Card,
  Step,
  Paper,
  Stack,
  Button,
  Divider,
  Stepper,
  StepLabel,
  Typography,
  CardContent,
} from "@mui/material";

// ----------------------------------------------------------------------

type RowProps = {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
};

const steps = [
  "รับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงิน",
  "จัดส่งสำเร็จ",
];

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="px-40 py-20">
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

        <Stack direction="column" spacing={2}>
          <OrderHeaderCard />

          <OrderDetailCard />
        </Stack>

        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
          <Button
            size="large"
            color="secondary"
            onClick={() => console.log("next step")}
          >
            เตรียมออเดอร์เสร็จสิ้น
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

// ----------------------------------------------------------------------

function OrderDetailCard() {
  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <Card>
      <Box sx={{ width: 1, backgroundColor: "primary.darker", px: 2, py: 2 }}>
        <Typography color="white" fontWeight={500}>
          สถานะออเดอร์
        </Typography>
      </Box>
      <CardContent>
        <Stepper
          color="secondary"
          activeStep={activeStep}
          alternativeLabel
          sx={{ px: 20, pt: 2.5, pb: 2 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
      <Divider />
      <CardContent sx={{ px: 6 }}>
        <Typography fontWeight={500} sx={{ mt: 1, mb: 2 }}>
          รายการสินค้า
        </Typography>
        <Stack direction="column" spacing={2} divider={<Divider />}>
          <ProductRow name="เอแคล์" price={147} quantity={3} />
          <ProductRow name="น้ำส้มกล่อง" price={49} quantity={1} />
          <ProductRow
            name="สแน็กบอกส์ 1"
            description="เอแคลร์, พายไส้ไก่, คุกกี้ตอนเฟล็กส์, น้ำส้มกล่อง"
            price={158}
            quantity={2}
          />
          <Stack spacing={1}>
            <ProductRow name="ราคาสินค้า" price={305} />
            <ProductRow name="ค่าจัดส่ง" price={40} />
          </Stack>
          <ProductRow name="ยอดการสั่งซื้อรวม" price={345} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductRow({ name, description, price, quantity }: RowProps) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column">
        <Typography>
          {name} {description ? `(${description})` : ""}
        </Typography>
        {quantity && (
          <Typography color="grey.600">{`จำนวน: ${quantity}`}</Typography>
        )}
      </Stack>
      <Stack direction="column" justifyContent="end">
        <Typography>{`${price} บาท`}</Typography>
      </Stack>
    </Stack>
  );
}

function OrderHeaderCard() {
  return (
    <Paper
      elevation={1}
      sx={{
        py: 4,
        px: 6,
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">เลขออเดอร์</Typography>
          <Typography fontWeight={500}>100004</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
          <Typography fontWeight={500}>13/11/2566</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">สถานะออเดอร์</Typography>
          <Typography fontWeight={500}>กำลังเตรียมออเดอร์</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ประเภทการชำระ</Typography>
          <Typography fontWeight={500}>จ่ายมัดจำ</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ตัวเลือกการชำระเงิน</Typography>
          <Typography fontWeight={500}>เครดิตการ์ด</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">เป็นจำนวนเงิน</Typography>
          <Typography fontWeight={500}>฿ 1,846</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
