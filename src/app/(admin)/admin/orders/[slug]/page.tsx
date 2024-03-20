"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { useSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";
import { fCurrency } from "@/utils/format";
import { adminFetcher } from "@/utils/axios";
import { OrderStatus } from "@prisma/client";
import { formatDate } from "@/lib/formatDate";
import Check from "@mui/icons-material/Check";
import { IOrderDetail } from "@/app/(client)/orders/types";
import React, { useMemo, useState, useEffect } from "react";
import UpdateOrderDialog from "@/components/admin/dialog/UpdateOrderDialog";
import CancelOrderDialog from "@/components/admin/dialog/CancelOrderDialog";
import {
  Box,
  Card,
  Step,
  Paper,
  Stack,
  Button,
  styled,
  Divider,
  Stepper,
  Backdrop,
  StepLabel,
  Typography,
  CardContent,
  StepConnector,
  StepIconProps,
  CircularProgress,
  stepConnectorClasses,
} from "@mui/material";

// ----------------------------------------------------------------------

type RowProps = {
  product?: {
    name: string;
    description?: string;
    price: number;
    quantity?: number;
    type: string;
  };
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  isDiscount?: boolean;
};

type IUpdateOrderRequest = {
  orderId: string;
  status: OrderStatus;
  trackingNo: string;
};

type IDeleteOrderRequest = {
  orderId: string;
};

type OrderProps = {
  data: IOrderDetail | undefined;
};

const stepsSinglePayment = [
  "รอชำระเงิน",
  "รอรับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "รอส่งมอบสินค้า",
  "กำลังเตรียมจัดส่ง",
  "ส่งมอบสำเร็จ",
];

const stepsDepositPayment = [
  "รอชำระมัดจำ",
  "รอรับออเดอร์",
  "กำลังเตรียมออเดอร์",
  "รอชำระเงินที่เหลือ",
  "กำลังเตรียมจัดส่ง",
  "รอส่งมอบสินค้า",
  "ส่งมอบสำเร็จ",
];

// ----------------------------------------------------------------------

async function sendUpdateOrderRequest(
  url: string,
  { arg }: { arg: IUpdateOrderRequest },
) {
  try {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(arg),
    }).then((res) => res.json());

    if (!res.response.success) throw new Error(res);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function sendCancelOrderRequest(
  url: string,
  { arg }: { arg: IDeleteOrderRequest },
) {
  try {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(arg),
    }).then((res) => res.json());

    if (!res.response.success) throw new Error(res);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
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

export default function OrderDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { enqueueSnackbar } = useSnackbar();

  const { getOrderById, updateOrder, cancelOrder } = apiPaths();

  const {
    data: orderData,
    isLoading,
    mutate: orderDataMutate,
  } = useSWR(slug ? getOrderById(slug) : null, adminFetcher);

  const { trigger: triggerUpdateOrder, isMutating: isMutatingUpdateOrder } =
    useSWRMutation(updateOrder(), sendUpdateOrderRequest);

  const { trigger: triggerCancelOrder, isMutating: isMutatingCancelOrder } =
    useSWRMutation(cancelOrder(), sendCancelOrderRequest);

  const [isTrackingRequired, setIsTrackingRequired] = useState(false);
  const [trackingNo, setTrackingNo] = useState("");
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);

  const [orderDetail, setOrderDetail] = useState<IOrderDetail>();

  useEffect(() => {
    setOrderDetail({
      ...orderData?.data,
    });
  }, [orderData]);

  async function handleUpdateOrder() {
    try {
      if (!orderDetail?.status) return;

      await triggerUpdateOrder({
        orderId: slug,
        status: orderDetail.status,
        trackingNo,
      });

      orderDataMutate();
      setIsOpenUpdate(false);
      enqueueSnackbar("อัพเดทออเดอร์สำเร็จ", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
    }
  }

  async function handleCancelOrder() {
    try {
      await triggerCancelOrder({
        orderId: slug,
      });

      orderDataMutate();
      setIsOpenCancel(false);
      enqueueSnackbar("ยกเลิกออเดอร์สำเร็จ", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
    }
  }

  const buttonActionText = useMemo(() => {
    let text;
    switch (orderDetail?.paymentType) {
      case "SINGLE":
        switch (orderDetail?.status) {
          case "PENDING_ORDER":
            text = "ยืนยันเพื่อรับออเดอร์";
            break;
          case "ON_PROCESS":
            if (orderDetail.receivedVia === "DELIVERY") {
              setIsTrackingRequired(true);
              text = "ยืนยันการจัดส่งออเดอร์เสร็จสิ้น";
            } else {
              text = "ยืนยันการส่งมอบออเดอร์เสร็จสิ้น";
            }
            break;

          case "ON_PACKING_PROCESS":
            setIsTrackingRequired(true);
            text = "ยืนยันการเตรียมจัดส่งเสร็จสิ้น";
            break;

          case "AWAITING_PICKUP":
            text = "ยืนยันการส่งมอบสินค้า";
            break;
        }
        break;
      case "INSTALLMENT":
        switch (orderDetail?.status) {
          case "PENDING_ORDER":
            text = "ยืนยันเพื่อรับออเดอร์";
            break;
          case "ON_PROCESS":
            text = "ยืนยันการเตรียมออเดอร์เสร็จสิ้น";
            break;
          case "PENDING_PAYMENT2":
            if (orderDetail.receivedVia === "DELIVERY") {
              setIsTrackingRequired(true);
              text = "ยืนยันจัดส่งออเดอร์เสร็จสิ้น";
            } else {
              text = "ยืนยันส่งมอบออเดอร์เสร็จสิ้น";
            }
            break;

          case "ON_PACKING_PROCESS":
            if (orderDetail.receivedVia === "DELIVERY") {
              setIsTrackingRequired(true);
              text = "ยืนยันการเตรียมจัดส่ง";
            }
            break;
          case "AWAITING_PICKUP":
            text = "ยืนยันการส่งมอบสินค้า";
            break;
        }
        break;
    }
    return text;
  }, [orderDetail]);

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

      {orderDetail?.status !== "COMPLETED" && !orderDetail?.isCancelled && (
        <Stack
          direction="row"
          justifyContent="end"
          sx={{ mt: 2, mb: 1 }}
          spacing={2}
        >
          <Button
            size="large"
            variant="outlined"
            color="error"
            onClick={() => setIsOpenCancel(true)}
          >
            ยกเลิกออเดอร์
          </Button>
          {!!buttonActionText && (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              onClick={() => setIsOpenUpdate(true)}
            >
              {buttonActionText}
            </Button>
          )}
        </Stack>
      )}

      <UpdateOrderDialog
        text={buttonActionText || ""}
        open={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        onUpdate={handleUpdateOrder}
        isLoading={isMutatingUpdateOrder}
        isTrackingRequired={isTrackingRequired}
        setTrackingNo={setTrackingNo}
      />
      <CancelOrderDialog
        open={isOpenCancel}
        onClose={() => setIsOpenCancel(false)}
        onCancel={handleCancelOrder}
        isLoading={isMutatingCancelOrder}
      />
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
      const awaitingPickUpIndex = stepsArray.indexOf("รอส่งมอบสินค้า");
      stepsArray.splice(awaitingPickUpIndex, 1);

      stepsArray.pop();
      stepsArray.push("จัดส่งไปยัง InterExpress");
    } else {
      const onPackingUpIndex = stepsArray.indexOf("กำลังเตรียมจัดส่ง");
      stepsArray.splice(onPackingUpIndex, 1);
    }

    const status = getStatus(data);
    const activeStepIndex = stepsArray.indexOf(status);
    if (data?.status === "COMPLETED") {
      setActiveStep(activeStepIndex !== -1 ? activeStepIndex + 1 : 0);
    } else {
      setActiveStep(activeStepIndex !== -1 ? activeStepIndex : 0);
    }
    setSteps(stepsArray);
  }, [data, data?.paymentType, data?.receivedVia]);

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
          connector={<QontoConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                error={data?.isCancelled && index === activeStep}
              >
                {data?.isCancelled && index === activeStep
                  ? "ออเดอร์ถูกยกเลิก"
                  : label}
              </StepLabel>
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
          {data?.items?.map((product: any, index: any) => (
            <ProductRow
              key={index}
              product={product}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
          <Stack spacing={1}>
            <ProductRow name="ราคาสินค้า" price={data?.subTotalPrice || 0} />
            <ProductRow name="ค่าจัดส่ง" price={data?.shippingFee || 0} />
            <ProductRow
              name="ส่วนลด"
              price={data?.discountPrice || 0}
              isDiscount
            />
          </Stack>
          <ProductRow name="ยอดการสั่งซื้อรวม" price={data?.totalPrice || 0} />
          {data?.paymentType === "INSTALLMENT" &&
            data?.status !== "COMPLETED" && (
              <Stack spacing={1}>
                <ProductRow name="ชำระแล้วทั้งสิ้น" price={data?.paid} />
                <ProductRow
                  name="ยอดคงเหลือที่ต้องชำระ"
                  price={data?.remaining}
                />
              </Stack>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductRow({
  name,
  price,
  quantity,
  product,
  isDiscount = false,
}: RowProps) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column">
        <Typography>
          {product?.type === "CUSTOM_CAKE" ? "เค้กออกแบบเอง" : name}
        </Typography>
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
          <Typography fontWeight={500}>{data?.orderNo || "-"}</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">วันที่สั่งออเดอร์</Typography>
          <Typography fontWeight={500}>
            {formatDate(data?.orderedAt?.toString() || "")}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">สถานะออเดอร์</Typography>
          <Typography fontWeight={500}>{status || ""}</Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ประเภทการชำระ</Typography>
          <Typography
            color={
              data?.paymentType === "SINGLE" ? "success.main" : "primary.main"
            }
            fontWeight={500}
          >
            {data?.paymentType
              ? data.paymentType === "SINGLE"
                ? "ชำระเต็มจำนวน"
                : "ชำระมัดจำ"
              : "-"}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ตัวเลือกการชำระเงิน</Typography>
          <Typography fontWeight={500}>
            {data?.paymentMethod?.join(", ") || "-"}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={0.5}>
          <Typography color="grey.800">ยอดรวมที่ต้องชำระ</Typography>
          <Typography fontWeight={500}>
            {data?.totalPrice ? `฿${fCurrency(data?.totalPrice)}` : "-"}
          </Typography>
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
              {`${data?.firstName || "-"} ${data?.lastName || ""}`}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5}>
            <Typography color="grey.800">เบอร์โทรศัพท์</Typography>
            <Typography fontWeight={500}>{data?.phone || "-"}</Typography>
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

function getStatus(item: IOrderDetail | undefined): string {
  let status = "-";
  switch (item?.receivedVia) {
    case "PICK_UP":
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
            case "AWAITING_PICKUP":
              status = "รอส่งมอบสินค้า";
              break;

            case "COMPLETED":
              status = "ส่งมอบสำเร็จ";
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
            case "AWAITING_PICKUP":
              status = "รอส่งมอบสินค้า";
              break;

            case "COMPLETED":
              status = "ส่งมอบสำเร็จ";
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
              status = "รอรับออเดอร์";
              break;

            case "ON_PROCESS":
              status = "กำลังเตรียมออเดอร์";
              break;

            case "ON_PACKING_PROCESS":
              status = "กำลังเตรียมจัดส่ง";
              break;

            case "COMPLETED":
              status = "จัดส่งไปยัง InterExpress";
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

            case "ON_PACKING_PROCESS":
              status = "กำลังเตรียมจัดส่ง";
              break;

            case "COMPLETED":
              status = "จัดส่งไปยัง InterExpress";
              break;
          }
          break;
      }
  }

  return status;
}
