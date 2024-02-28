import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { OrderStatus } from "@prisma/client";
import { NextRequest } from "next/server";

type LineItem = {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
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
        lineItems.push({
          price_data: {
            currency: "thb",
            unit_amount: cake.pricePer,
            product_data: {
              name: cake.name,
            },
          },
          quantity: cake.quantity,
        });
      }

      for (let refreshment of order.orderRefreshment) {
        lineItems.push({
          price_data: {
            currency: "thb",
            unit_amount: refreshment.pricePer,
            product_data: {
              name: refreshment.name,
            },
          },
          quantity: refreshment.quantity,
        });
      }

      for (let snackBox of order.orderSnackBox) {
        lineItems.push({
          price_data: {
            currency: "thb",
            unit_amount: snackBox.pricePer,
            product_data: {
              name: snackBox.name,
            },
          },
          quantity: snackBox.quantity,
        });
      }
    } else if (order.status == OrderStatus.PENDING_PAYMENT2) {
      let remaining = order.totalPrice;
      for (let payment of order.payment) {
        remaining = remaining - payment.amount;
      }
      order.payment;

      lineItems.push({
        price_data: {
          currency: "thb",
          unit_amount: remaining,
          product_data: {
            name: "ยอดค้างชำระ",
          },
        },
        quantity: 1,
      });
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
