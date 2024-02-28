import { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prismaOrder } from "@/persistence/order";
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

    const { orderId } = body;
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

    await prismaOrder().updateOrderById(orderId, {
      status: OrderStatus.CANCELLED,
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
