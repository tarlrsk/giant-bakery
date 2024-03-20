import { prisma } from "@/lib/prisma";
import { Prisma, Refreshment } from "@prisma/client";

export function prismaRefreshment() {
  return {
    getAllRefreshments,
    getRefreshmentId,
    updateRefreshment,
    getRefreshmentIds,
  };
}

async function getAllRefreshments(): Promise<Refreshment[]> {
  const refreshments = await prisma.refreshment.findMany();
  return refreshments;
}

async function getRefreshmentId(refreshmentId: string): Promise<Refreshment | null> {
  const refreshment = await prisma.refreshment.findUnique({
    where: {
      id: refreshmentId
    }
  })
  return refreshment;
}

async function getRefreshmentIds(refreshmentIds: string[]): Promise<Refreshment[]> {
  const refreshment = await prisma.refreshment.findMany({
    where: {
      id: { in: refreshmentIds }
    }
  })
  return refreshment;
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
