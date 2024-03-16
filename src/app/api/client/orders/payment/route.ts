import { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prismaUser } from "@/persistence/user";
import { prismaOrder } from "@/persistence/order";
import { createStripeSessionPayment2 } from "@/lib/stripe";
import { responseWrapper } from "@/utils/api-response-wrapper";

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

    const { userId, orderId } = body;
    const order = await prismaOrder().getOrderById(orderId);
    if (!order) {
      return responseWrapper(
        404,
        null,
        `Order with ID ${orderId} is not found.`,
      );
    }

    const user = await prismaUser().getUserById(userId);
    if (!user) {
      return responseWrapper(404, null, `User with ID ${userId} is not found.`);
    }

    let discount = 0;
    let shippingFee = 0;

    const lineItems: LineItem[] = [];

    if (order.status == OrderStatus.PENDING_PAYMENT1) {
      for (let cake of order.orderCake) {
        lineItems.push({
          price_data: {
            currency: "thb",
            unit_amount: cake.pricePer,
            product_data: {
              images: [],
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
              images: [],
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
              images: [],
              name: snackBox.name,
            },
          },
          quantity: snackBox.quantity,
        });
      }

      discount = order.discountPrice;
      shippingFee = order.shippingFee;
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
            images: [],
            name: "ยอดค้างชำระ",
          },
        },
        quantity: 1,
      });
    } else {
      return responseWrapper(
        409,
        null,
        "Order Status is available for payment at this time.",
      );
    }

    const session = await createStripeSessionPayment2(
      userId,
      order.id,
      discount,
      shippingFee,
      lineItems,
      req,
      order.status,
    );

    const data = {
      stripeUrl: session.url,
    };

    return responseWrapper(200, data, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
