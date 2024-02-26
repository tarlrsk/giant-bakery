"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { adminFetcher } from "@/utils/axios";
import { formatDate } from "@/lib/formatDate";
import React, { useState, useEffect } from "react";
import {
  OrderStatus,
  PaymentType,
  ReceivedVia,
  CartItemType,
  PaymentMethod,
} from "@prisma/client";
import {
  Box,
  Card,
  Step,
  Paper,
  Stack,
  Button,
  Divider,
  Stepper,
  Backdrop,
  StepLabel,
  Typography,
  CardContent,
  CircularProgress,
} from "@mui/material";

// ----------------------------------------------------------------------

type RowProps = {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  isDiscount?: boolean;
};

type OrderDetail = {
  orderId: string;
  firstName: string;
  lastName: string;
  phone: string;
  orderedAt: Date;
  paymentMethod: PaymentMethod[];
  receivedVia: ReceivedVia;
  totalPrice: number;
  status: OrderStatus;
  paymentType: PaymentType;
  remark: string | null;
  shippingFee: number;
  discountPrice: number;
  paid: number;
  remaining: number;
  items: Item[] | any;
  address: {
    address: string;
    district: string;
    subdistrict: string;
    province: string;
    postcode: string;
  } | null;
};

type Item = {
  name: string;
  quantity: number;
  type: CartItemType;
  price: number;
  pricePer: number;
  subItem: string[];
};

type OrderProps = {
  data: OrderDetail;
};

const steps = [
  "รอรับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงิน",
  "จัดส่งสำเร็จ",
];

const stepsSinglePayment = [
  "รอชำระเงิน",
  "รอรับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "ส่งมอบสำเร็จ",
];

const stepsDepositPayment = [
  "รอชำระมัดจำ",
  "รอรับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงินที่เหลือ",
  "ส่งมอบสำเร็จ",
];

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { getOrderById } = apiPaths();

  const { data: orderData, isLoading } = useSWR(
    slug ? getOrderById(slug) : null,
    adminFetcher,
  );

  // const orderStatus = [
  //   "PENDING_PAYMENT1",
  //   "PENDING_ORDER",
  //   "ON_PROCESS",
  //   "PENDING_PAYMENT2",
  //   "COMPLETED",
  //   "CANCELLED",
  // ];

  const orderDetail = orderData?.data || {};

  console.log("orderDetail", orderDetail);

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

      <Stack direction="column" spacing={2}>
        <OrderHeaderCard data={orderDetail} />

        <OrderAddressCard data={orderDetail} />

        <OrderDetailCard data={orderDetail} />
      </Stack>

      <Stack direction="row" justifyContent="end" sx={{ mt: 2, mb: 1 }}>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={() => console.log("next step")}
        >
          เตรียมออเดอร์เสร็จสิ้น
        </Button>
      </Stack>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    </Box>
  );
}

// ----------------------------------------------------------------------

function OrderDetailCard({ data }: OrderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let stepsArray = [];
    if (data?.paymentType === "SINGLE") {
      stepsArray = [...stepsSinglePayment];
    } else {
      stepsArray = [...stepsDepositPayment];
    }

    if (data?.receivedVia === "DELIVERY") {
      stepsArray.pop();
      stepsArray.push("จัดส่งไปยัง InterExpress แล้ว");
    }

    const status = getStatus(data);
    console.log("status", status);
    const activeStepIndex = stepsArray.indexOf(status);
    setActiveStep(activeStepIndex !== -1 ? activeStepIndex : 0);

    setSteps(stepsArray);
  }, [data, data?.paymentType, data?.receivedVia]);

  const totalProductPrice = data?.items?.reduce((total: any, product: any) => {
    return total + product.price * product.quantity;
  }, 0);

  return (
    <Card>
      <Box sx={{ width: 1, backgroundColor: "secondary.main", px: 2, py: 2 }}>
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
        <Typography fontWeight={500} variant="body1" sx={{ mt: 1, mb: 2 }}>
          รายการสินค้า
        </Typography>
        <Stack direction="column" spacing={2} divider={<Divider />}>
          <ProductRow name="เอแคล์" price={147} quantity={3} />
          <ProductRow name="น้ำส้มกล่อง" price={49} quantity={1} />
          {data?.items?.map((product: any, index: any) => (
            <ProductRow
              key={index}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
          <Stack spacing={1}>
            <ProductRow name="ราคาสินค้า" price={totalProductPrice} />
            <ProductRow name="ค่าจัดส่ง" price={data?.shippingFee} />
            <ProductRow name="ส่วนลด" price={data?.discountPrice} isDiscount />
          </Stack>
          <ProductRow name="ยอดการสั่งซื้อรวม" price={data?.totalPrice} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductRow({
  name,
  description,
  price,
  quantity,
  isDiscount = false,
}: RowProps) {
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
        <Typography>{`${isDiscount ? `-${price}` : price} บาท`}</Typography>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function OrderHeaderCard({ data }: OrderProps) {
  const status = getStatus(data);

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
          <Typography fontWeight={500}>
            {data?.orderId?.replace(/-/g, "")}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
          <Typography fontWeight={500}>
            {formatDate(data?.orderedAt?.toString())}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">สถานะออเดอร์</Typography>
          <Typography fontWeight={500}>{status}</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ประเภทการชำระ</Typography>
          <Typography
            color={
              data?.paymentType === "SINGLE" ? "success.main" : "primary.main"
            }
            fontWeight={500}
          >
            {data?.paymentType === "SINGLE" ? "ชำระจำนวนเต็ม" : "ชำระมัดจำ"}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ตัวเลือกการชำระเงิน</Typography>
          <Typography fontWeight={500}>
            {data?.paymentMethod.join(", ")}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ยอดรวมที่ต้องชำระ</Typography>
          <Typography fontWeight={500}>฿{data?.totalPrice}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function OrderAddressCard({ data }: OrderProps) {
  return (
    <Card elevation={1}>
      <Box sx={{ width: 1, backgroundColor: "secondary.main", px: 2, py: 2 }}>
        <Typography color="white" fontWeight={500}>
          {`ข้อมูลการ${
            data?.receivedVia === "DELIVERY" ? "การจัดส่ง" : "การส่งมอบ"
          }`}
        </Typography>
      </Box>
      <CardContent sx={{ px: 6 }}>
        <Stack
          direction="row"
          justifyContent={
            data?.receivedVia === "DELIVERY" ? "space-between" : "start"
          }
          spacing={data?.receivedVia === "DELIVERY" ? 0 : 8}
          sx={{ width: 1 }}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">ชื่อผู้รับ</Typography>
            <Typography fontWeight={500}>
              {`${data?.firstName} ${data?.lastName}` ?? "-"}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">เบอร์โทรศัพท์</Typography>
            <Typography fontWeight={500}>{data?.phone ?? "-"}</Typography>
          </Stack>

          {data?.receivedVia === "DELIVERY" && (
            <>
              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">ที่อยู่</Typography>
                <Typography fontWeight={500}>
                  {data?.address?.address ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">อำเภอ</Typography>
                <Typography fontWeight={500}>
                  {data?.address?.district ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">ตำบล</Typography>
                <Typography fontWeight={500}>
                  {data?.address?.subdistrict ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">จังหวัด</Typography>
                <Typography fontWeight={500}>
                  {data?.address?.province ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">รหัสไปรษณีย์</Typography>
                <Typography fontWeight={500}>
                  {data?.address?.postcode ?? "-"}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function getStatus(item: OrderDetail): string {
  let status = "";
  switch (item?.receivedVia) {
    case "PICK_UP":
      console.log("PICKUP com", item?.receivedVia);
      switch (item?.paymentType) {
        case "SINGLE":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระเงิน";
              break;

            case "PENDING_ORDER":
              status = "รอรับออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "COMPLETED":
              status = "ส่งมอบสำเร็จ";
              break;

            case "CANCELLED":
              status = "ถูกยกเลิก";
              break;
          }
          break;

        case "INSTALLMENT":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระมัดจำ";
              break;

            case "PENDING_ORDER":
              status = "รอรับออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "PENDING_PAYMENT2":
              status = "รอชำระเงินที่เหลือ";
              break;

            case "COMPLETED":
              status = "ส่งมอบสำเร็จ";
              break;

            case "CANCELLED":
              status = "ถูกยกเลิก";
              break;
          }
      }
      break;

    case "DELIVERY":
      console.log("DELIVERY com", item?.receivedVia);

      switch (item?.paymentType) {
        case "SINGLE":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระเงิน";
              break;

            case "PENDING_ORDER":
              status = "รอรับออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "COMPLETED":
              status = "จัดส่งไปยัง InterExpress แล้ว";
              break;

            case "CANCELLED":
              status = "ถูกยกเลิก";
              break;
          }
        case "INSTALLMENT":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระมัดจำ";
              break;

            case "PENDING_ORDER":
              status = "รอรับออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "PENDING_PAYMENT2":
              status = "รอชำระเงินที่เหลือ";
              break;

            case "COMPLETED":
              status = "จัดส่งไปยัง InterExpress แล้ว";
              break;

            case "CANCELLED":
              status = "ถูกยกเลิก";
              break;
          }
      }
  }

  return status;
}
