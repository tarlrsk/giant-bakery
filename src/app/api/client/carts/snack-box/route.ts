import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartSnackBoxValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartSnackBoxValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { refreshmentIds, type, userId, quantity } = body;
    const refreshments = await prisma.refreshment.findMany({
      where: {
        id: { in: refreshmentIds },
        isDeleted: false,
      },
    });

    const allRefreshmentsFound = refreshmentIds.every((id: string) =>
      refreshments.some((refreshment) => refreshment.id === id),
    );

    if (!allRefreshmentsFound) {
      return responseWrapper(
        404,
        null,
        "One or more refreshmentIds not found.",
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
      include: {
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
      },
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
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.id),
        ),
    );

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.id),
        ),
    );

    let snackBoxPrice = 0;
    for (var refreshment of refreshments) {
      snackBoxPrice += refreshment.price;
    }

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
              type: CartItemType.SNACK_BOX,
              quantity: quantity,
              snackBox: {
                create: {
                  price: snackBoxPrice,
                  refreshments: {
                    create: refreshmentIds.map((refreshmentId: string) => ({
                      refreshment: { connect: { id: refreshmentId } },
                    })),
                  },
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
