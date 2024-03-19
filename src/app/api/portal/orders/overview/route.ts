import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { responseWrapper } from "@/utils/api-response-wrapper";

export const revalidate = 0;

type overview = {
  totalOrder: number;
  todayOrder: number;
  pendingOrder: number;
  completedOrder: number;
  cancelledOrder: number;
};

// function convertTZ(date: D, tzString) {
//   return new Date(
//     (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
//       timeZone: tzString,
//     }),
//   );
// }

export async function GET(_req: NextRequest) {
  try {
    const groupByStatusOrder = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const data: overview = {
      totalOrder: 0,
      todayOrder: 0,
      pendingOrder: 0,
      completedOrder: 0,
      cancelledOrder: 0,
    };

    const pendingOrder = groupByStatusOrder.find(
      (x) => x.status === OrderStatus.PENDING_ORDER,
    )?._count.id;
    if (pendingOrder) {
      data.pendingOrder = pendingOrder;
    }

    const completed = groupByStatusOrder.find(
      (x) => x.status === OrderStatus.COMPLETED,
    )?._count.id;
    if (completed) {
      data.completedOrder = completed;
    }

    const cancelledOrder = await prisma.order.aggregate({
      where: {
        isCancelled: true,
      },
      _count: {
        id: true,
      },
    });
    data.cancelledOrder = cancelledOrder._count.id ?? 0;

    // // usage: Asia/Jakarta is GMT+7
    // convertTZ("2012/04/20 10:10:30 +0000", "Asia/Jakarta"); // Tue Apr 20 2012 17:10:30 GMT+0700 (Western Indonesia Time)

    // // Resulting value is regular Date() object
    // const convertedDate = convertTZ(
    //   "2012/04/20 10:10:30 +0000",
    //   "Asia/Jakarta",
    // );
    // convertedDate.getHours(); // 17

    // // Bonus: You can also put Date object to first arg
    // const date = new Date();
    // convertTZ(date, "Asia/Jakarta"); // current date-time in jakarta.

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayOrder = await prisma.order.aggregate({
      where: {
        orderedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _count: {
        id: true,
      },
    });
    data.todayOrder = todayOrder._count.id ?? 0;

    const countOrders = await prisma.order.aggregate({
      _count: {
        id: true,
      },
    });

    data.totalOrder = countOrders._count.id;

    return responseWrapper(200, data, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
