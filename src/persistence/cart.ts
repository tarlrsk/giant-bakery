import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type PrismaCart = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        customerCake: {
          include: {
            cake: true;
            pound: true;
            base: true;
            filling: true;
            cream: true;
            topEdge: true;
            bottomEdge: true;
            decoration: true;
            surface: true;
          };
        };
        refreshment: true;
        snackBox: {
          include: {
            refreshments: {
              include: {
                refreshment: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export function prismaCart() {
  return {
    getCartByUserId,
  };
}

async function getCartByUserId(userId: string): Promise<PrismaCart | null> {
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

  return cart;
}
