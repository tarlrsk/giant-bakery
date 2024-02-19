import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartPresetSnackBoxValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartPresetSnackBoxValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { snackBoxId, type, userId, quantity } = body;
    const snackBox = await prisma.snackBox.findFirst({
      where: {
        id: snackBoxId,
        isDeleted: false,
      },
    });

    if (!snackBox) {
      return responseWrapper(
        404,
        null,
        `SnackBox with id ${snackBoxId} is not found`,
      );
    }

    const CartInclude = {
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
              decoration: true,
              surfaces: true,
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
            customerCake: {
              include: {
                cake: true,
                pound: true,
                base: true,
                filling: true,
                cream: true,
                topEdge: true,
                bottomEdge: true,
                decoration: true,
                surface: true,
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
      (item) => item.snackBox?.id === body.snackBoxId,
    );

    const existingItemIndex = cart.items.findIndex(
      (item) => item.snackBox?.id === body.snackBoxId,
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
              type: CartItemType.SNACK_BOX,
              quantity: quantity,
              snackBox: {
                connect: {
                  id: snackBox.id,
                },
              },
            },
          },
        },
        include: CartInclude,
      });
    }

    revalidatePath(paths.cartList());

    return responseWrapper(200, cart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
