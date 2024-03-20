import { NextRequest } from "next/server";
import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";
import {
  PaymentType,
  ReceivedVia,
  OrderStatus,
  CartItemType,
  PaymentMethod,
} from "@prisma/client";

type GetOrderById = {
  params: {
    id: string;
  };
};

type OrderDetail = {
  orderId: string;
  firstName: string;
  lastName: string;
  phone: string;
  orderedAt: Date;
  paymentMethod: PaymentMethod[];
  receivedVia: ReceivedVia;
  trackingNo: string | null;
  subTotalPrice: number;
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
  description: string;
  quantity: number;
  type: CartItemType;
  price: number;
  pricePer: number;
  subItem: string[];
};

export async function GET(_req: NextRequest, { params }: GetOrderById) {
  try {
    const { id } = params;
    const order = await prismaOrder().getOrderById(id);
    if (!order) {
      return responseWrapper(404, null, `Order with ID ${id} is not found.`);
    }

    var paid = 0;
    const paymentTypes: PaymentMethod[] = [];
    for (var payment of order.payment) {
      paid = paid + payment.amount;
      paymentTypes.push(payment.type);
    }

    const data: OrderDetail = {
      orderId: order.id,
      firstName: order.cFirstName,
      lastName: order.cLastName,
      phone: order.phone ? order.phone : "",
      orderedAt: order.orderedAt,
      paymentMethod: paymentTypes,
      receivedVia: order.receivedVia,
      trackingNo: order.trackingNo,
      subTotalPrice: order.subTotalPrice,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentType: order.paymentType,
      remark: order.remark,
      shippingFee: order.shippingFee,
      discountPrice: order.discountPrice,
      isCancelled: order.isCancelled,
      paid: paid,
      remaining: order.totalPrice - paid,
      items: [],
      address: null,
    };

    if (order.receivedVia === ReceivedVia.DELIVERY) {
      data.address = {
        address: order.address!,
        district: order.district!,
        subdistrict: order.subdistrict!,
        province: order.province!,
        postcode: order.postcode!,
      };
    }

    const items: Item[] = [];

    for (let cake of order.orderCake) {
      let item: Item = {
        name: cake.name,
        description: "",
        quantity: cake.quantity,
        price: cake.price,
        pricePer: cake.pricePer,
        subItem: [],
        type: "PRESET_CAKE",
      };
      if (cake.cakeType === "CUSTOM") {
        item.type = "CUSTOM_CAKE";
      }
      if (cake.size) {
        item.subItem.push(cake.size);
      }
      if (cake.base) {
        item.subItem.push(cake.base);
      }
      if (cake.filling) {
        item.subItem.push(cake.filling);
      }
      if (cake.cream) {
        item.subItem.push(cake.cream + `(${cake.creamColor})`);
      }
      if (cake.topEdge) {
        item.subItem.push(cake.topEdge + `(${cake.topEdgeColor})`);
      }
      if (cake.bottomEdge) {
        item.subItem.push(cake.bottomEdge + `(${cake.bottomEdgeColor})`);
      }
      if (cake.surface) {
        item.subItem.push(cake.surface);
      }
      item.description = item.subItem.join(", ");
      items.push(item);
    }

    for (let refreshment of order.orderRefreshment) {
      let item: Item = {
        name: refreshment.name,
        quantity: refreshment.quantity,
        price: refreshment.price,
        pricePer: refreshment.pricePer,
        subItem: [],
        type: CartItemType.REFRESHMENT,
        description: "",
      };

      items.push(item);
    }

    for (let snackBox of order.orderSnackBox) {
      let item: Item = {
        name: snackBox.name,
        description: "",
        quantity: snackBox.quantity,
        price: snackBox.price,
        pricePer: snackBox.pricePer,
        subItem: [],
        type: CartItemType.SNACK_BOX,
      };

      for (let refreshment of snackBox.refreshments) {
        item.subItem.push(refreshment.name);
      }
      item.description = item.subItem.join(", ");
    }

    data.items = items;

    return responseWrapper(200, data, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
