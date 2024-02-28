"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
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
  Stack,
  Divider,
  Stepper,
  StepLabel,
  Typography,
  CardContent,
} from "@mui/material";

import { Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

type RowProps = {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
};

type IOrderDetail = {
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
  item: IOrderDetail;
};

const stepsSinglePayment = ["รอชำระเงิน", "กำลังเตรียมออเดอร์", "ส่งมอบสำเร็จ"];

const stepsDepositPayment = [
  "รอชำระมัดจำ",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงินที่เหลือ",
  "ส่งมอบสำเร็จ",
];

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  const { getClientOrderById } = apiPaths();

  const { data } = useSWR(getClientOrderById(id), fetcher);

  const item: IOrderDetail = data?.response?.data || {};

  const handlePayRestPayment = async () => {
    try {
      console.log("pay rest payment");
      // TODO: call api to Stripe here
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className={`relative px-40 py-20`}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, width: 1 }}
        >
          <Typography variant="h5" fontWeight={400}>
            {`ออเดอร์ #${item?.orderId?.replace(/-/g, "") || ""}`}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={2}>
          <OrderHeaderCard item={item} />

          <AddressCard item={item} />

          <OrderDetailCard item={item} />
        </Stack>

        {item?.status === "PENDING_PAYMENT2" && (
          <Stack
            direction="row"
            justifyContent="end"
            sx={{ mt: 2, mb: 1 }}
            spacing={2}
          >
            <Button
              size="lg"
              radius="sm"
              color="secondary"
              onClick={handlePayRestPayment}
            >
              ชำระเงินที่เหลือ
            </Button>
          </Stack>
        )}
      </Box>
    </div>
  );
}

// ----------------------------------------------------------------------

function OrderDetailCard({ item }: OrderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    let stepsArray = [];
    if (item?.paymentType === "SINGLE") {
      stepsArray = [...stepsSinglePayment];
    } else {
      stepsArray = [...stepsDepositPayment];
    }

    if (item?.receivedVia === "DELIVERY") {
      stepsArray.pop();
      stepsArray.push("จัดส่งไปยัง InterExpress แล้ว");
    }

    const status = getStatus(item);
    const activeStepIndex = stepsArray.indexOf(status);
    setActiveStep(activeStepIndex !== -1 ? activeStepIndex : 0);

    setSteps(stepsArray);
  }, [item, item?.paymentType, item?.receivedVia]);

  const totalProductPrice = item?.items?.reduce((total: any, product: any) => {
    return total + product.price * product.quantity;
  }, 0);

  const isCancelled = item?.status === "CANCELLED";

  return (
    <Card>
      <Box sx={{ width: 1, backgroundColor: "primary.darker", px: 2, py: 2 }}>
        <Typography color="white" fontWeight={500}>
          สถานะออเดอร์
        </Typography>
      </Box>
      <CardContent>
        <Stepper
          color="success"
          activeStep={activeStep}
          alternativeLabel
          sx={{ px: 20, pt: 2.5, pb: 2 }}
        >
          {!isCancelled ? (
            steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))
          ) : (
            <Step>
              <StepLabel error>ออเดอร์ถูกยกเลิก</StepLabel>
            </Step>
          )}
        </Stepper>
      </CardContent>
      {item?.remark && (
        <CardContent sx={{ px: 6 }}>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Stack direction="column">Remark</Stack>
            <Stack direction="column" justifyContent="end">
              <Typography>{item?.remark ? item?.remark : "-"}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      )}
      <Divider />
      <CardContent sx={{ px: 6 }}>
        <Typography fontWeight={500} variant="body1" sx={{ mt: 1, mb: 2 }}>
          รายการสินค้า
        </Typography>
        <Stack direction="column" spacing={2} divider={<Divider />}>
          {item?.items?.map((product: any, index: any) => (
            <ProductRow
              key={index}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
          <Stack spacing={1}>
            <ProductRow name="ราคาสินค้า" price={totalProductPrice} />
            <ProductRow name="ค่าจัดส่ง" price={item?.shippingFee} />
          </Stack>
          <ProductRow name="ยอดการสั่งซื้อรวม" price={item?.totalPrice} />
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

function OrderHeaderCard({ item }: OrderProps) {
  const status = getStatus(item);

  return (
    <Card>
      <Box sx={{ width: 1, backgroundColor: "primary.darker", px: 2, py: 2 }}>
        <Typography color="white" fontWeight={500}>
          ข้อมูลออเดอร์
        </Typography>
      </Box>
      <CardContent sx={{ px: 6 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">เลขออเดอร์</Typography>
            <Typography fontWeight={500}>
              {item?.orderId?.replace(/-/g, "") || ""}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
            <Typography fontWeight={500}>
              {formatDate(item?.orderedAt?.toString())}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">สถานะออเดอร์</Typography>
            <Typography fontWeight={500}>{status}</Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">ตัวเลือกการชำระเงิน</Typography>
            <Typography
              color={
                item?.paymentType === "SINGLE" ? "success.main" : "primary"
              }
              fontWeight={500}
            >
              {item?.paymentType === "SINGLE" ? "ชำระเต็มจำนวน" : "ชำระมัดจำ"}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">ยอดรวม</Typography>
            <Typography fontWeight={500}>฿{item?.totalPrice}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AddressCard({ item }: OrderProps) {
  return (
    <Card elevation={1}>
      <Box sx={{ width: 1, backgroundColor: "primary.darker", px: 2, py: 2 }}>
        <Typography color="white" fontWeight={500}>
          {`ข้อมูลการ${
            item?.receivedVia === "DELIVERY" ? "การจัดส่ง" : "การส่งมอบ"
          }`}
        </Typography>
      </Box>
      <CardContent sx={{ px: 6 }}>
        <Stack
          direction="row"
          justifyContent={
            item?.receivedVia === "DELIVERY" ? "space-between" : "start"
          }
          spacing={item?.receivedVia === "DELIVERY" ? 0 : 8}
          sx={{ width: 1 }}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">ชื่อผู้รับ</Typography>
            <Typography fontWeight={500}>
              {`${item?.firstName} ${item?.lastName}` ?? "-"}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">เบอร์โทรศัพท์</Typography>
            <Typography fontWeight={500}>{item?.phone ?? "-"}</Typography>
          </Stack>

          {item?.receivedVia === "DELIVERY" && (
            <>
              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">ที่อยู่</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.address ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">อำเภอ</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.district ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">ตำบล</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.subdistrict ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">จังหวัด</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.province ?? "-"}
                </Typography>
              </Stack>

              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">รหัสไปรษณีย์</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.postcode ?? "-"}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function getStatus(item: IOrderDetail): string {
  let status = "";
  switch (item?.receivedVia) {
    case "PICK_UP":
      switch (item?.paymentType) {
        case "SINGLE":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระเงิน";
              break;

            case "PENDING_ORDER":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "COMPLETED":
              status = "ส่งมอบสำเร็จ";
              break;

            case "CANCELLED":
              status = "ยกเลิก";
              break;
          }
        case "INSTALLMENT":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระมัดจำ";
              break;

            case "PENDING_ORDER":
              status = "กำลังเตรียมออเดอร์";
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
              status = "ยกเลิก";
              break;
          }
      }
      break;

    case "DELIVERY":
      switch (item?.paymentType) {
        case "SINGLE":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระเงิน";
              break;

            case "PENDING_ORDER":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "COMPLETED":
              status = "จัดส่งไปยัง InterExpress แล้ว";
              break;

            case "CANCELLED":
              status = "ยกเลิก";
              break;
          }
        case "INSTALLMENT":
          switch (item?.status) {
            case "PENDING_PAYMENT1":
              status = "รอชำระมัดจำ";
              break;

            case "PENDING_ORDER":
              status = "กำลังเตรียมออเดอร์";
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
              status = "ยกเลิก";
              break;
          }
      }
  }

  return status;
}
