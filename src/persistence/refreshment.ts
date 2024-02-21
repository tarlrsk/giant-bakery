import { prisma } from "@/lib/prisma";
import { Prisma, Refreshment } from "@prisma/client";

export function prismaRefreshment() {
  return {
    getAllRefreshments,
    updateRefreshment,
  };
}

async function getAllRefreshments(): Promise<Refreshment[]> {
  const refreshments = await prisma.refreshment.findMany();
  return refreshments;
}

async function updateRefreshment(
  refreshmentId: string,
  data:
    | (Prisma.Without<
        Prisma.RefreshmentUpdateInput,
        Prisma.RefreshmentUncheckedUpdateInput
      > &
        Prisma.RefreshmentUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.RefreshmentUncheckedUpdateInput,
        Prisma.RefreshmentUpdateInput
      > &
        Prisma.RefreshmentUpdateInput),
) {
  await prisma.refreshment.update({
    where: {
      id: refreshmentId,
    },
    data: data,
  });
}
