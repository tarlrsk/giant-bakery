import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const product = await stripe.products.create({
      name: "T-shirt",
      images: [
        "https://image.makewebeasy.net/makeweb/m_1920x0/Ub8wb5z91/Homemadebakery2022/14_%E0%B9%80%E0%B8%AD%E0%B9%81%E0%B8%84%E0%B8%A5%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2%E0%B9%82%E0%B8%AE%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%94.jpg",
      ],
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
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 2,
        },
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 4,
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
