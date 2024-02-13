import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { CartItemType, Refreshment } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartSnackBoxValidationSchema } from "@/lib/validationSchema";
import { connect } from "http2";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartSnackBoxValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const { refreshmentIds, type, userId, packageType, beverage, quantity } =
      body;
    const data = await prisma.refreshment.findMany({
      where: {
        id: { in: refreshmentIds },
        isDeleted: false,
      },
    });

    const refreshments: Refreshment[] = [];
    refreshmentIds.forEach((id: string) => {
      let refreshment = data.find((r) => r.id === id);
      if (refreshment) {
        refreshments.push(refreshment);
      }
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
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.refreshmentId),
        ) &&
        item.snackBox?.packageType === packageType &&
        item.snackBox?.beverage === beverage,
    );

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.snackBox?.refreshments.length === refreshmentIds.length &&
        item.snackBox?.refreshments.every((refreshment) =>
          refreshmentIds.includes(refreshment.refreshmentId),
        ) &&
        item.snackBox?.packageType === packageType &&
        item.snackBox?.beverage === beverage,
    );

    let snackBoxPrice = 0;
    refreshments.forEach((refreshment) => {
      snackBoxPrice += refreshment.price;
    });

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
                  packageType: packageType,
                  beverage: beverage,
                  refreshments: {
                    create: refreshments.map((refreshment) => ({
                      // Assuming refreshment.id is a string or number
                      refreshmentId: refreshment.id,
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
