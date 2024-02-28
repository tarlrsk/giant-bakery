"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import React, { useState, useEffect } from "react";
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

import { getStatus, IOrderDetail } from "../types";

// ----------------------------------------------------------------------

type RowProps = {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  isDiscount?: boolean;
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

async function sendCheckoutRequest(
  url: string,
  {
    arg,
  }: {
    arg: {
      orderId: string | null;
    };
  },
) {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(arg),
    }).then((res) => res.json());

    if (!res.response.success) throw new Error(res.error);

    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const { checkoutOrder, getClientOrderById } = apiPaths();

  const { data } = useSWR(getClientOrderById(id), fetcher);

  const item: IOrderDetail =
    {
      ...data?.response?.data,
      paymentType: "INSTALLMENT",
      status: "PENDING_PAYMENT2",
      isCancelled: true,
    } || {};

  const { trigger: triggerCheckoutOrder, isMutating: isMutatingCheckoutOrder } =
    useSWRMutation(checkoutOrder(), sendCheckoutRequest);

  const handlePayRestPayment = async () => {
    try {
      // TODO: call api to Stripe here
      console.log("pay rest payment");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const handlePayFirstPayment = async () => {
    try {
      const res = await triggerCheckoutOrder({
        orderId: item?.orderId || "",
      });
      const url = res?.response?.data?.stripeUrl;
      router.replace(url);
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

        {item?.status === "PENDING_PAYMENT2" && !item?.isCancelled && (
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

        {item?.status === "PENDING_PAYMENT1" && !item?.isCancelled && (
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
              onClick={handlePayFirstPayment}
              isLoading={isMutatingCheckoutOrder}
            >
              {item?.paymentType === "SINGLE" ? "ชำระเงิน" : "ชำระมัดจำ"}
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
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel error={item?.isCancelled && index === activeStep}>
                {item?.isCancelled && index === activeStep
                  ? "ออเดอร์ถูกยกเลิก"
                  : label}
              </StepLabel>
            </Step>
          ))}
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
            <ProductRow name="ราคาสินค้า" price={item?.subTotalPrice} />
            <ProductRow name="ค่าจัดส่ง" price={item?.shippingFee} />
            <ProductRow name="ส่วนลด" price={item?.discountPrice} isDiscount />
          </Stack>
          <ProductRow name="ยอดการสั่งซื้อรวม" price={item?.totalPrice} />
          {item?.paymentType === "INSTALLMENT" && (
            <Stack spacing={1}>
              <ProductRow name="ชำระแล้วทั้งสิ้น" price={item?.paid} />
              <ProductRow name="ยอดที่ต้องชำระ" price={item?.remaining} />
            </Stack>
          )}
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
        <Typography>{`${isDiscount ? "-" : ""}${price} บาท`}</Typography>
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
