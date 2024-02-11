import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const product = await stripe.products.create({
      name: "T-shirt",
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000,
      currency: "thb",
    });
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/?success=true`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });
    // res.redirect(303, session.url);
    return responseWrapper(303, session.url, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
    //   res.status(err.statusCode || 500).json(err.message);
  }
}
