import { NextRequest } from "next/server";
import { prismaOrder } from "@/persistence/order";
import { OrderStatus, PaymentType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const orders = await prismaOrder().getAllOrder();

    return responseWrapper(200, orders, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderId, trackingNo } = body;
    if (!orderId) {
      return responseWrapper(400, null, `OrderId is missing.`);
    }

    const order = await prismaOrder().getOrderById(orderId);
    if (!order) {
      return responseWrapper(
        404,
        null,
        `Order with ID ${orderId} is not found.`,
      );
    }

    if (order.paymentType == PaymentType.SINGLE) {
      switch (order.status) {
        case OrderStatus.PENDING_PAYMENT1:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.PENDING_ORDER,
          });
          break;
        case OrderStatus.PENDING_ORDER:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.ON_PROCESS,
          });
          break;
        case OrderStatus.ON_PROCESS:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.COMPLETED,
            trackingNo: trackingNo,
          });
          break;
      }
    } else {
      switch (order.status) {
        case OrderStatus.PENDING_PAYMENT1:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.PENDING_ORDER,
          });
          break;
        case OrderStatus.PENDING_ORDER:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.ON_PROCESS,
          });
          break;
        case OrderStatus.ON_PROCESS:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.PENDING_PAYMENT2,
          });
          break;
        case OrderStatus.PENDING_PAYMENT2:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.ON_PACKING_PROCESS,
          });
          break;
        case OrderStatus.ON_PACKING_PROCESS:
          await prismaOrder().updateOrderById(orderId, {
            status: OrderStatus.COMPLETED,
            trackingNo: trackingNo,
          });
          break;
      }
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
