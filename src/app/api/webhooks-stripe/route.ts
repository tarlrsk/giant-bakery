import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { OrderStatus, PaymentMethod } from "@prisma/client";

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

        console.log(paymentIntent);

        await prismaOrder().updateOrderStatusById(orderId, {
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
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return responseWrapper(200, null, null);
  } catch (err: any) {
    console.log(err);
    return responseWrapper(500, null, err.message);
  }
}
