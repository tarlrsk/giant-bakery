import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

export const createStripeSession = async function (
  userId: string,
  orderId: string,
  paymentMethod: any,
  shippingFee: number,
  discount: number,
  lineItems: LineItem[],
  req: NextRequest,
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  // TODO DISCOUNT
  const coupon = await stripe.coupons.create({
    amount_off: discount * 100,
    duration: "once",
    currency: "thb",
  });

  let origin = req.headers.get("origin");
  if (origin) {
    origin = "http://localhost:3000";
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: "thb",
        unit_amount: item.price_data.unit_amount * 100, // Stripe expects the amount in smallest currency unit (cents), hence multiplying by 100
        product_data: {
          images: item.price_data.product_data.images,
          name: item.price_data.product_data.name,
        },
      },
      quantity: item.quantity,
    })),
    discounts: [
      {
        coupon: coupon.id,
      },
    ],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingFee * 100,
            currency: "thb",
          },
          display_name: "Inter Express Logistic",
        },
      },
    ],
    mode: "payment",
    success_url: `${origin}/?checkout-success=true`, // TODO CHANGE TO HEAD ORIGIN URL
    cancel_url: `${origin}/?checkout-canceled=true`,
    payment_intent_data: {
      metadata: {
        userId: userId,
        orderId: orderId,
      },
    },
    payment_method_types: [paymentMethod.toLowerCase()],
  });

  return session;
};
