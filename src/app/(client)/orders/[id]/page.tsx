"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import useSWRMutation from "swr/mutation";
import { fCurrency } from "@/utils/format";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import Check from "@mui/icons-material/Check";
import getCurrentUser from "@/actions/userActions";
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Card,
  Step,
  Stack,
  styled,
  Divider,
  Stepper,
  StepLabel,
  Typography,
  CardContent,
  StepConnector,
  StepIconProps,
  stepConnectorClasses,
} from "@mui/material";

import { Button } from "@nextui-org/react";

import { getStatus, IOrderDetail } from "../types";

// ----------------------------------------------------------------------

type RowProps = {
  product?: {
    name: string;
    description?: string;
    price: number;
    quantity?: number;
  };
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  isDiscount?: boolean;
};

type OrderProps = {
  item: IOrderDetail;
};

const stepsSinglePayment = [
  "รอชำระเงิน",
  "กำลังเตรียมออเดอร์",
  "รอส่งมอบสินค้า",
  "กำลังเตรียมจัดส่ง",
  "ส่งมอบสำเร็จ",
];

const stepsDepositPayment = [
  "รอชำระมัดจำ",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงินที่เหลือ",
  "กำลังเตรียมจัดส่ง",
  "รอส่งมอบสินค้า",
  "ส่งมอบสำเร็จ",
];

async function sendCheckoutRequest(
  url: string,
  {
    arg,
  }: {
    arg: {
      orderId: string | null;
      userId: string | null;
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

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: theme.palette.primary.main,
    }),
    "& .QontoStepIcon-completedIcon": {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    "& .QontoStepIcon-circle.error": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: theme.palette.error.main,
    },
  }),
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className, error } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : error ? (
        <div className="QontoStepIcon-circle error" />
      ) : (
        <div className="QontoStepIcon-circle " />
      )}
    </QontoStepIconRoot>
  );
}

// ----------------------------------------------------------------------

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const { checkoutOrder, getClientOrderById } = apiPaths();

  const { data } = useSWR(getClientOrderById(id), fetcher);

  const item = useMemo<IOrderDetail>(() => {
    return (
      {
        ...data?.response?.data,
      } || {}
    );
  }, [data]);

  console.log("item", item);

  const { trigger: triggerCheckoutOrder, isMutating: isMutatingCheckoutOrder } =
    useSWRMutation(checkoutOrder(), sendCheckoutRequest);

  const handlePayPayment = async () => {
    try {
      const currentUser = await getCurrentUser();

      const res = await triggerCheckoutOrder({
        orderId: item?.orderId || "",
        userId: currentUser?.id || "",
      });
      const url = res?.response?.data?.stripeUrl;
      router.replace(url);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className="container relative py-10 md:py-20">
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, width: 1 }}
        >
          <Typography variant="h6" fontWeight={400}>
            {`ออเดอร์ #${item?.orderNo || ""}`}
          </Typography>
          {item?.trackingNo && (
            <Typography variant="h6" fontWeight={400}>
              {`Tracking Number: ${item?.trackingNo}`}
            </Typography>
          )}
        </Stack>

        <Stack direction="column" spacing={2}>
          <OrderHeaderCard item={item} />

          <AddressCard item={item} />

          <OrderDetailCard item={item} />
        </Stack>

        {(item?.status === "PENDING_PAYMENT1" ||
          item?.status === "PENDING_PAYMENT2") &&
          !item?.isCancelled && (
            <Stack
              direction="row"
              justifyContent="end"
              sx={{ mt: 2, mb: 1 }}
              spacing={2}
            >
              <Button
                size="lg"
                radius="md"
                color="secondary"
                onClick={handlePayPayment}
                isLoading={isMutatingCheckoutOrder}
              >
                {item?.paymentType === "SINGLE"
                  ? "ชำระเงิน"
                  : item?.status === "PENDING_PAYMENT1"
                    ? "ชำระมัดจำ"
                    : "ชำระเงินที่เหลือ"}
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
      const awaitingPickUpIndex = stepsArray.indexOf("รอส่งมอบสินค้า");
      stepsArray.splice(awaitingPickUpIndex, 1);

      stepsArray.pop();
      stepsArray.push("จัดส่งไปยัง InterExpress");
    } else {
      const onPackingUpIndex = stepsArray.indexOf("กำลังเตรียมจัดส่ง");
      stepsArray.splice(onPackingUpIndex, 1);
    }

    const status = getStatus(item);
    const activeStepIndex = stepsArray.indexOf(status);
    if (item.status === "COMPLETED") {
      setActiveStep(activeStepIndex !== -1 ? activeStepIndex + 1 : 0);
    } else {
      setActiveStep(activeStepIndex !== -1 ? activeStepIndex : 0);
    }

    setSteps(stepsArray);
  }, [item, item?.paymentType, item?.receivedVia]);

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
          sx={{ px: { xs: 0, md: 6 }, pt: 2.5, pb: 2 }}
          connector={<QontoConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                error={item?.isCancelled && index === activeStep}
              >
                {item?.isCancelled && index === activeStep
                  ? "ออเดอร์ถูกยกเลิก"
                  : label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
      {item?.remark && (
        <CardContent sx={{ px: { xs: 2, md: 6 } }}>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Stack direction="column">Remark</Stack>
            <Stack direction="column" justifyContent="end">
              <Typography>{item?.remark ? item?.remark : "-"}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      )}
      <Divider />
      <CardContent sx={{ px: { xs: 2, md: 6 } }}>
        <Typography fontWeight={500} variant="body1" sx={{ mt: 1, mb: 2 }}>
          {item?.trackingNo}
        </Typography>
        <Typography fontWeight={500} variant="body1" sx={{ mt: 1, mb: 2 }}>
          รายการสินค้า
        </Typography>
        <Stack direction="column" spacing={2} divider={<Divider />}>
          {item?.items?.map((product: any, index: any) => (
            <ProductRow
              key={index}
              product={product}
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
          {item?.paymentType === "INSTALLMENT" &&
            item?.status !== "COMPLETED" && (
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
  product,
  name,
  price,
  quantity,
  isDiscount = false,
}: RowProps) {
  console.log("product", product);
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column">
        <Typography>{name}</Typography>
        {product?.description && (
          <Typography color="grey.600">{product?.description}</Typography>
        )}
        {quantity && (
          <Typography color="grey.600">{`จำนวน: ${quantity}`}</Typography>
        )}
      </Stack>
      <Stack direction="column" justifyContent="end">
        <Typography>{`${
          isDiscount ? `-${fCurrency(price) || "0"} ` : fCurrency(price)
        } บาท`}</Typography>
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
      <CardContent sx={{ px: { xs: 2, md: 6 }, pb: { md: "16px !important" } }}>
        <Stack
          direction={{ md: "row", sm: "column" }}
          justifyContent="space-between"
          sx={{ width: 1 }}
          spacing={{ xs: 1.5, md: 0 }}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">เลขออเดอร์</Typography>
            <Typography fontWeight={500}>
              {item?.orderNo ? item?.orderNo?.replace(/-/g, "") : "-"}
            </Typography>
          </Stack>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
            <Typography fontWeight={500}>
              {formatDate(item?.orderedAt?.toString())}
            </Typography>
          </Stack>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Typography color="grey.800">ตัวเลือกการชำระเงิน</Typography>
            <Typography fontWeight={500}>
              {item?.paymentType
                ? item.paymentType === "SINGLE"
                  ? "ชำระเต็มจำนวน"
                  : "ชำระมัดจำ"
                : "-"}
            </Typography>
          </Stack>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Typography color="grey.800">สถานะออเดอร์</Typography>
            <Typography
              color={
                item?.isCancelled
                  ? "rgb(220 38 38 / var(--tw-text-opacity))"
                  : item?.status === "COMPLETED"
                    ? "rgb(22 163 74 / var(--tw-text-opacity))"
                    : item?.status === "PENDING_PAYMENT1" ||
                        item?.status === "PENDING_PAYMENT2"
                      ? "rgb(202 138 4 / var(--tw-text-opacity))"
                      : "primary"
              }
              fontWeight={500}
            >
              {item.isCancelled ? "ถูกยกเลิก" : status}
            </Typography>
          </Stack>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Typography color="grey.800">ยอดรวม</Typography>
            <Typography fontWeight={500}>
              {item?.totalPrice ? `฿${fCurrency(item?.totalPrice)}` : "-"}
            </Typography>
          </Stack>

          {/* Mobile */}

          <Stack
            direction="row"
            sx={{ display: { xs: "flex", md: "none" } }}
            spacing={11}
          >
            <Stack direction="column" spacing={0.5}>
              <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
              <Typography fontWeight={500}>
                {formatDate(item?.orderedAt?.toString())}
              </Typography>
            </Stack>
            <Stack
              direction="column"
              spacing={0.5}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Typography color="grey.800">สถานะออเดอร์</Typography>
              <Typography fontWeight={500}>{status}</Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            sx={{ display: { xs: "flex", md: "none" } }}
            spacing={6.75}
          >
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
            <Stack
              direction="column"
              spacing={0.5}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Typography color="grey.800">ยอดรวม</Typography>
              <Typography fontWeight={500}>
                {item?.totalPrice ? `฿${item?.totalPrice}` : "-"}
              </Typography>
            </Stack>
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
      <CardContent sx={{ px: { xs: 2, md: 6 }, pb: { md: "16px !important" } }}>
        <Stack
          direction={{ md: "row", sm: "column" }}
          justifyContent={
            item?.receivedVia === "DELIVERY" ? "space-between" : "start"
          }
          spacing={item?.receivedVia === "DELIVERY" ? { xs: 1.5, md: 0 } : 8}
          sx={{ width: 1 }}
        >
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Typography color="grey.800">ชื่อผู้รับ</Typography>
            <Typography fontWeight={500}>
              {`${item?.firstName || "-"} ${item?.lastName || ""}` ?? "-"}
            </Typography>
          </Stack>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Typography color="grey.800">เบอร์โทรศัพท์</Typography>
            <Typography fontWeight={500}>{item?.phone ?? "-"}</Typography>
          </Stack>

          {/* Mobile */}
          <Stack
            direction="row"
            spacing={12}
            sx={{ display: { xs: "flex", md: "none" } }}
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
          </Stack>

          {item?.receivedVia === "DELIVERY" && (
            <>
              <Stack direction="column" spacing={0.5}>
                <Typography color="grey.800">ที่อยู่</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.address ?? "-"}
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={0.5}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography color="grey.800">อำเภอ</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.district ?? "-"}
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={0.5}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography color="grey.800">ตำบล</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.subdistrict ?? "-"}
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={0.5}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography color="grey.800">จังหวัด</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.province ?? "-"}
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={0.5}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography color="grey.800">รหัสไปรษณีย์</Typography>
                <Typography fontWeight={500}>
                  {item?.address?.postcode ?? "-"}
                </Typography>
              </Stack>

              {/* Mobile */}

              <Stack
                direction="row"
                spacing={10.25}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
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
              </Stack>

              <Stack
                direction="row"
                spacing={14}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
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
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
