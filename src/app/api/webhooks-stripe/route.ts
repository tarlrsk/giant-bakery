import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prismaOrder } from "@/persistence/order";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { prismaRefreshment } from "@/persistence/refreshment";
import { responseWrapper } from "@/utils/api-response-wrapper";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig!,
      endpointSecret,
    );
  } catch (err: any) {
    return responseWrapper(409, null, err.message);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        switch (paymentIntent.metadata.orderStatus) {
          case OrderStatus.PENDING_PAYMENT1:
            const order = await prismaOrder().getOrderById(orderId);
            if (!order) {
              return responseWrapper(
                404,
                null,
                `Order with ID ${orderId} is not found.`,
              );
            }
            const dbRefreshments =
              await prismaRefreshment().getAllRefreshments();
            for (let refreshment of order.orderRefreshment) {
              if (refreshment.refreshmentId) {
                let dbRefreshment = dbRefreshments.find(
                  (r) => r.id === refreshment.refreshmentId,
                );
                if (!dbRefreshment) {
                  return responseWrapper(
                    500,
                    null,
                    "Something went wrong with order refreshment.",
                  );
                }
                dbRefreshment.currQty -= refreshment.quantity;
                await prismaRefreshment().updateRefreshment(
                  refreshment.refreshmentId,
                  dbRefreshment,
                );
              }
            }
            for (let snackBox of order.orderSnackBox) {
              for (let refreshment of snackBox.refreshments) {
                if (refreshment.refreshmentId) {
                  let dbRefreshment = dbRefreshments.find(
                    (r) => r.id === refreshment.refreshmentId,
                  );
                  if (!dbRefreshment) {
                    return responseWrapper(
                      500,
                      null,
                      "Something went wrong with order snack-box.",
                    );
                  }
                  dbRefreshment.currQty -= 1;
                  await prismaRefreshment().updateRefreshment(
                    refreshment.refreshmentId,
                    dbRefreshment,
                  );
                }
              }
            }
            await prismaOrder().updateOrderById(orderId, {
              status: OrderStatus.PENDING_ORDER,
              payment: {
                create: {
                  amount: paymentIntent.amount_received / 100,
                  type: paymentIntent.payment_method_types[0].toUpperCase() as PaymentMethod,
                  userId: paymentIntent.metadata.userId,
                },
              },
            });
            break;
          case OrderStatus.PENDING_PAYMENT2:
            await prismaOrder().updateOrderById(orderId, {
              status: OrderStatus.ON_PACKING_PROCESS,
              payment: {
                create: {
                  amount: paymentIntent.amount_received / 100,
                  type: paymentIntent.payment_method_types[0].toUpperCase() as PaymentMethod,
                  userId: paymentIntent.metadata.userId,
                },
              },
            });
            break;
        }

        console.log(paymentIntent);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    console.log(err);
    return responseWrapper(500, null, err.message);
  }
}
