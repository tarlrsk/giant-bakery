import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartCustomSnackBoxValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartCustomSnackBoxValidationSchema.safeParse(body);

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
          customerCake: {
            include: {
              cake: true,
              size: true,
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
                size: true,
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
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.id),
        ) &&
        item.snackBox?.beverage === body.beverage &&
        item.snackBox?.packageType == body.packageType,
    );

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.id),
        ) &&
        item.snackBox?.beverage === body.beverage &&
        item.snackBox?.packageType == body.packageType,
    );

    let snackBoxPrice = 0;
    for (var refreshmentId of refreshmentIds) {
      let refreshment = refreshments.find(r => r.id == refreshmentId)
      if (refreshment) {
        snackBoxPrice += refreshment.price;
      }
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
                  name: "Custom Snack Box",
                  beverage: body.beverage,
                  packageType: body.packageType,
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

    revalidatePath(paths.cartList());

    return responseWrapper(200, cart, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
