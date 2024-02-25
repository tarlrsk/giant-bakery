import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { prismaOrder } from "@/persistence/order";
import {
  OrderStatus,
  PaymentMethod,
  PaymentType,
  ReceivedVia,
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
  totalPrice: number;
  status: OrderStatus;
  paymentType: PaymentType;
  remark: string | null;
  shippingFee: number;
  discountPrice: number;
  paid: number;
  remaining: number;
  items: Items;
  address: {
    address: string;
    district: string;
    subdistrict: string;
    province: string;
    postcode: string;
  } | null;
};

type Items = {
  name: string;
  quantity: number;
  price: number;
  pricePer: number;
};

export async function GET(req: NextRequest, { params }: GetOrderById) {
  try {
    const { id } = params;
    const order = await prismaOrder().getOrderById(id);
    if (!order) {
      return responseWrapper(404, null, `Order with ID ${id} is not found.`);
    }

    const orderResponse: OrderDetail = {
      orderId: order.id,
      firstName: order.cFirstName,
      lastName: order.cLastName,
      phone: order.phone ? order.phone : "",
      orderedAt: order.orderedAt,
      paymentMethod: order.payment.map((p) => p.type),
      receivedVia: order.receivedVia,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentType: order.paymentType,
      remark: order.remark,
      shippingFee: order.shippingFee,
      discountPrice: order.discountPrice,
      paid: 1,
      remaining: 0,
      items: {
        name: "",
        quantity: 0,
        price: 0,
        pricePer: 0,
      },
      address: null,
    };

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
