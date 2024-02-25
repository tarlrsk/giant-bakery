import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { prismaOrder } from "@/persistence/order";
import {
  CartItemType,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  ReceivedVia,
  SnackBox,
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

export async function GET(req: NextRequest, { params }: GetOrderById) {
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
      totalPrice: order.totalPrice,
      status: order.status,
      paymentType: order.paymentType,
      remark: order.remark,
      shippingFee: order.shippingFee,
      discountPrice: order.discountPrice,
      paid: paid,
      remaining: order.totalPrice - paid,
      items: [],
      address: null,
    };

    if (order.receivedVia == ReceivedVia.DELIVERY) {
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
        quantity: cake.quantity,
        price: cake.price,
        pricePer: cake.pricePer,
        subItem: [],
        type: CartItemType.CAKE,
      };
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
        item.subItem.push(cake.cream);
      }
      if (cake.topEdge) {
        item.subItem.push(cake.topEdge);
      }
      if (cake.bottomEdge) {
        item.subItem.push(cake.bottomEdge);
      }
      if (cake.surface) {
        item.subItem.push(cake.surface);
      }
      // TODO Color Cake
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
      };

      items.push(item);
    }

    for (let snackBox of order.orderSnackBox) {
      let item: Item = {
        name: snackBox.name,
        quantity: snackBox.quantity,
        price: snackBox.price,
        pricePer: snackBox.pricePer,
        subItem: [],
        type: CartItemType.SNACK_BOX,
      };

      for (let refreshment of snackBox.refreshments) {
        item.subItem.push(refreshment.name);
      }

      data.items = items;
    }

    return responseWrapper(200, items, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
