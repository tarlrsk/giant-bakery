import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartRefreshmentValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartRefreshmentValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { refreshmentId, type, userId, quantity } = body;
    const refreshment = await prisma.refreshment.findUnique({
      where: {
        id: refreshmentId,
        isDeleted: false,
      },
    });

    if (!refreshment) {
      return responseWrapper(
        404,
        null,
        `Refreshment with given id ${refreshmentId} not found.`,
      );
    }

    const CartInclude = {
      items: {
        include: {
          presetCake: {
            include: {
              variants: true,
            },
          },
          customCake: {
            include: {
              cake: true,
              variants: true,
            },
          },
          refreshment: true,
          snackBox: {
            include: {
              refreshments: {
                include: {
                  refreshment: true,
                },
              },
            },
          },
        },
      },
    };

    let cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
        type: type,
      },
      include: CartInclude,
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          type: type,
        },
        include: CartInclude,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.refreshmentId === refreshmentId,
    );

    const existingItemIndex = cart.items.findIndex(
      (item) => item.refreshmentId === refreshmentId,
    );

    if (existingItem) {
      cart.items[existingItemIndex] = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: CartInclude.items.include,
      });
    } else {
      cart = await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            create: {
              type: CartItemType.REFRESHMENT,
              quantity: quantity,
              refreshment: {
                connect: {
                  id: refreshmentId,
                },
              },
            },
          },
        },
        include: CartInclude,
      });
    }

    return responseWrapper(200, cart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
