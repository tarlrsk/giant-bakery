import { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { orderUpdateValidateSchema } from "@/lib/validationSchema";

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
    const validate = orderUpdateValidateSchema.safeParse(body);
    if (!validate.success) {
      return responseWrapper(400, null, validate.error.message);
    }

    const { orderId, status, trackingNo } = body;
    if (!orderId) {
      return responseWrapper(
        404,
        null,
        `Order with ID ${orderId} is not found.`,
      );
    }

    if (status === OrderStatus.COMPLETED) {
      await prismaOrder().updateOrderById(orderId, {
        status: status,
        trackingNo: trackingNo,
      });
    } else {
      await prismaOrder().updateOrderById(orderId, {
        status: status,
      });
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
