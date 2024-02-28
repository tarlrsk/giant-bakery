import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { CartItemType } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { cartCustomCakeValidationSchema } from "@/lib/validationSchema";

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
    const validation = cartCustomCakeValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    // TODO USER ID FROM TOKEN OR COOKIE ID
    const {
      cakeId,
      cakeType,
      type,
      userId,
      quantity,
      sizeId,
      baseId,
      fillingId,
      creamId,
      creamColor,
      topEdgeId,
      topEdgeColor,
      bottomEdgeId,
      bottomEdgeColor,
      decorationId,
      surfaceId,
    } = body;
    const cake = await prisma.cake.findUnique({
      where: {
        id: cakeId,
        isDeleted: false,
        type: cakeType,
      },
      include: CakeInclude,
    });

    if (!cake) {
      return responseWrapper(
        404,
        null,
        `${cakeType} Cake with given id ${cakeId} not found.`,
      );
    }

    const isIdInList = (list: any[], id: any) => {
      if (id && id != "") {
        return list.some((item) => item.id === id);
      }
      return true;
    };

    const validateIds = () => {
      const invalidIds = [];
      if (!isIdInList(cake.creams, creamId)) {
        invalidIds.push("creamId");
      }
      if (!isIdInList(cake.topEdges, topEdgeId)) {
        invalidIds.push("topEdgeId");
      }
      if (!isIdInList(cake.bottomEdges, bottomEdgeId)) {
        invalidIds.push("bottomEdgeId");
      }
      if (!isIdInList(cake.decorations, decorationId)) {
        invalidIds.push("decorationId");
      }
      if (!isIdInList(cake.surfaces, surfaceId)) {
        invalidIds.push("surfaceId");
      }
      return invalidIds;
    };

    // Validate the IDs
    const invalidIds = validateIds();

    if (invalidIds.length > 0) {
      return responseWrapper(
        400,
        null,
        `Invalid IDs: ${invalidIds.join(", ")}`,
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
          (item.customerCake?.fillingId === null && fillingId === "")) &&
        (item.customerCake?.creamId === creamId ||
          (item.customerCake?.creamId === null && creamId === "")) &&
        (item.customerCake?.topEdgeId === topEdgeId ||
          (item.customerCake?.topEdgeId === null && topEdgeId === "")) &&
        (item.customerCake?.bottomEdgeId === bottomEdgeId ||
          (item.customerCake?.bottomEdgeId === null && bottomEdgeId === "")) &&
        (item.customerCake?.decorationId === decorationId ||
          (item.customerCake?.decorationId === null && decorationId === "")) &&
        (item.customerCake?.surfaceId === surfaceId ||
          (item.customerCake?.surfaceId === null && surfaceId === "")) &&
        (item.customerCake?.creamColor === creamColor ||
          (item.customerCake?.creamColor === null && creamColor === "")) &&
        (item.customerCake?.topEdgeColor === topEdgeColor ||
          (item.customerCake?.topEdgeColor === null && topEdgeColor === "")) &&
        (item.customerCake?.bottomEdgeColor === bottomEdgeColor ||
          (item.customerCake?.bottomEdgeColor === null &&
            bottomEdgeColor === "")),
    );

    const existingItemsIndex = cart.items.findIndex(
      (item) =>
        item.customerCake?.cakeId === cakeId &&
        (item.customerCake?.baseId === baseId ||
          (item.customerCake?.baseId === null && baseId === "")) &&
        (item.customerCake?.sizeId === sizeId ||
          (item.customerCake?.sizeId === null && sizeId === "")) &&
        (item.customerCake?.fillingId === fillingId ||
          (item.customerCake?.fillingId === null && fillingId === "")) &&
        (item.customerCake?.creamId === creamId ||
          (item.customerCake?.creamId === null && creamId === "")) &&
        (item.customerCake?.topEdgeId === topEdgeId ||
          (item.customerCake?.topEdgeId === null && topEdgeId === "")) &&
        (item.customerCake?.bottomEdgeId === bottomEdgeId ||
          (item.customerCake?.bottomEdgeId === null && bottomEdgeId === "")) &&
        (item.customerCake?.decorationId === decorationId ||
          (item.customerCake?.decorationId === null && decorationId === "")) &&
        (item.customerCake?.surfaceId === surfaceId ||
          (item.customerCake?.surfaceId === null && surfaceId === "")) &&
        (item.customerCake?.creamColor === creamColor ||
          (item.customerCake?.creamColor === null && creamColor === "")) &&
        (item.customerCake?.topEdgeColor === topEdgeColor ||
          (item.customerCake?.topEdgeColor === null && topEdgeColor === "")) &&
        (item.customerCake?.bottomEdgeColor === bottomEdgeColor ||
          (item.customerCake?.bottomEdgeColor === null &&
            bottomEdgeColor === "")),
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
              type: CartItemType.CAKE,
              quantity: quantity,
              customerCake: {
                create: {
                  name: cake.name,
                  price: cake.price,
                  isActive: true,
                  type: cake.type,
                  size: {
                    connect: sizeId ? { id: sizeId } : undefined,
                  },
                  base: {
                    connect: baseId ? { id: baseId } : undefined,
                  },
                  filling: {
                    connect: fillingId ? { id: fillingId } : undefined,
                  },
                  cream: {
                    connect: creamId ? { id: creamId } : undefined,
                  },
                  creamColor: creamColor,
                  topEdge: {
                    connect: topEdgeId ? { id: topEdgeId } : undefined,
                  },
                  topEdgeColor: topEdgeColor,
                  bottomEdge: {
                    connect: bottomEdgeId ? { id: bottomEdgeId } : undefined,
                  },
                  bottomEdgeColor: bottomEdgeColor,
                  decoration: {
                    connect: decorationId ? { id: decorationId } : undefined,
                  },
                  surface: {
                    connect: surfaceId ? { id: surfaceId } : undefined,
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
