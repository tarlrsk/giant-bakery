import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { CakeType, CartItemType } from "@prisma/client";
import { cartCustomCakeValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartCustomCakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const { cakeId, variantIds, type, userId, quantity } = body;
    const cake = await prisma.cake.findUnique({
      where: {
        id: cakeId,
        isDeleted: false,
        type: CakeType.CUSTOM,
      },
      include: {
        variants: true,
      },
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `Custom Cake with given id ${cakeId} not found.`,
      );
    }

    const variantsExist = variantIds.every((variantId: string) =>
      cake.variants.some((variant) => variant.id === variantId),
    );

    if (!variantsExist) {
      return responseWrapper(
        400,
        null,
        "Provided variantIds are not part of the custom cake.",
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
              refreshments: true,
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
        item.customCake?.cakeId === cakeId &&
        item.customCake?.variants.length === variantIds.length &&
        item.customCake?.variants.every((variant) =>
          variantIds.includes(variant.id),
        ),
    );

    const existingItemsIndex = cart.items.findIndex(
      (item) =>
        item.customCake?.cakeId === cakeId &&
        item.customCake?.variants.length === variantIds.length &&
        item.customCake?.variants.every((variant) =>
          variantIds.includes(variant.id),
        ),
    );

    if (existingItem) {
      cart.items[existingItemsIndex] = await prisma.cartItem.update({
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
              type: CartItemType.CUSTOM_CAKE,
              quantity: quantity,
              customCake: {
                create: {
                  name: cake.name,
                  price: cake.price,
                  isActive: true,
                  cake: {
                    connect: {
                      id: cakeId,
                    },
                  },
                  variants: {
                    connect: variantIds.map((id: string) => ({ id: id })),
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
