import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { OrderStatus } from "@prisma/client";
import { NextRequest } from "next/server";

type LineItem = {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      images: string[];
      name: string;
    };
  };
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderId } = body;
    const order = await prismaOrder().getOrderById(orderId);
    if (!order) {
      return responseWrapper(
        404,
        null,
        `Order with ID ${orderId} is not found.`,
      );
    }

    const lineItems: LineItem[] = [];

    if (order.status == OrderStatus.PENDING_PAYMENT1) {
      for (let cake of order.orderCake) {
      }
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
