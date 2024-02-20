import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { addressId, cartId, userId } = body;

    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            customerCake: {
              include: {
                cake: true,
                pound: true,
                base: true,
                filling: true,
                cream: true,
                topEdge: true,
                bottomEdge: true,
                surface: true,
              },
            },
            refreshment: true,
            snackBox: {
              include: {
                refreshments: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return responseWrapper(
        404,
        null,
        `Cart with cart id: ${cartId} and user id: ${userId} is not found.`,
      );
    }

    const lineItems = [] as LineItem[];
    for (var cartItem of cart?.items) {
      switch (cartItem.type) {
        case "CAKE":
          if (!cartItem.customerCake) {
            return responseWrapper(409, null, "Cake Type is missing cake.");
          }

          var image = [];
          if (cartItem.customerCake.cake.imagePath) {
            image.push(await getFileUrl(cartItem.customerCake.cake.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.customerCake.price,
              product_data: {
                images: image,
                name: cartItem.customerCake.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
        case "REFRESHMENT":
          if (!cartItem.refreshment) {
            return responseWrapper(
              409,
              null,
              "Refreshment is missing refreshment.",
            );
          }

          var image = [];
          if (cartItem.refreshment.imagePath) {
            image.push(await getFileUrl(cartItem.refreshment.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.refreshment.price,
              product_data: {
                images: image,
                name: cartItem.refreshment.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
        case "SNACK_BOX":
          console.log(cartItem.type);
          if (!cartItem.snackBox) {
            return responseWrapper(409, null, "Snack Box is snackbox.");
          }
          var image = [];
          if (cartItem.snackBox.imagePath) {
            image.push(await getFileUrl(cartItem.snackBox.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.snackBox.price,
              product_data: {
                images: image,
                name: cartItem.snackBox.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
      }
    }

    // TODO DISCOUNT
    const coupon1 = await stripe.coupons.create({
      amount_off: 2000,
      duration: "once",
      currency: "thb",
    });

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
          coupon: coupon1.id,
        },
      ],
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "thb",
            },
            display_name: "Inter Express Logistic",
          },
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/?checkout-success=true`, // TODO CHANGE TO HEAD ORIGIN URL
      cancel_url: `http://localhost:3000/?checkout-canceled=true`,
      payment_intent_data: {
        metadata: {
          userId: userId,
          addressId: addressId,
          orderId: "1234567",
        },
      },
      payment_method_types: ["promptpay", "card"],
    });
    return responseWrapper(200, session.url, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
