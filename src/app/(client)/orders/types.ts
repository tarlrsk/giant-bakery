import {
  OrderStatus,
  PaymentType,
  ReceivedVia,
  CartItemType,
  PaymentMethod,
} from "@prisma/client";

// ----------------------------------------------------------------------

export function getStatus(item: IOrderDetail): string {
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
              status = "กำลังเตรียมออเดอร์";
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
              status = "กำลังเตรียมออเดอร์";
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
          break;
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
              status = "กำลังเตรียมออเดอร์";
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

export type IOrderDetail = {
  orderId: string;
  orderNo: string;
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
  isCancelled: boolean;
  subTotalPrice: number;
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
