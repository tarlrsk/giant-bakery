import { prisma } from "@/lib/prisma";
import { CustomerAddress } from "@prisma/client";

export function prismaCustomerAddress() {
  return {
    getUserAddressById,
  };
}

export async function getUserAddressById(
  addressId: string,
): Promise<CustomerAddress | null> {
  const address = await prisma.customerAddress.findUnique({
    where: {
      id: addressId,
    },
  });
  return address;
}
