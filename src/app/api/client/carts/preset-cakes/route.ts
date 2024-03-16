import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { CakeType, CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartCustomCakeValidationSchema, cartPresetCakeValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

const CakeInclude = {
  sizes: true,
  bases: true,
  fillings: true,
  creams: true,
  topEdges: true,
  bottomEdges: true,
  decorations: true,
  surfaces: true,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cartPresetCakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const {
      cakeId,
      type,
      userId,
      quantity,
      sizeId,
      baseId,
      fillingId,
    } = body;
    const cake = await prisma.cake.findUnique({
      where: {
        id: cakeId,
        isDeleted: false,
      },
      include: CakeInclude,
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `Cake with given id ${cakeId} not found.`,
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
        item.customerCake?.cakeId === cakeId &&
        (item.customerCake?.baseId === baseId ||
          (item.customerCake?.baseId === null && baseId === "")) &&
        (item.customerCake?.sizeId === sizeId ||
          (item.customerCake?.sizeId === null && sizeId === "")) &&
        (item.customerCake?.fillingId === fillingId ||
          (item.customerCake?.fillingId === null && fillingId === "")) 
    );

    const existingItemsIndex = cart.items.findIndex(
      (item) =>
        item.customerCake?.cakeId === cakeId &&
        (item.customerCake?.baseId === baseId ||
          (item.customerCake?.baseId === null && baseId === "")) &&
        (item.customerCake?.sizeId === sizeId ||
          (item.customerCake?.sizeId === null && sizeId === "")) &&
        (item.customerCake?.fillingId === fillingId ||
          (item.customerCake?.fillingId === null && fillingId === ""))
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
              customerCake: {
                create: {
                  name: cake.name,
                  price: cake.price,
                  isActive: true,
                  type: CakeType.PRESET,
                  size: {
                    connect: sizeId ? { id: sizeId } : undefined,
                  },
                  base: {
                    connect: baseId ? { id: baseId } : undefined,
                  },
                  filling: {
                    connect: fillingId ? { id: fillingId } : undefined,
                  },
                  cake: {
                    connect: cakeId ? { id: cakeId } : undefined,
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
