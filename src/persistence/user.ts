import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export function prismaUser() {
  return {
    getUserById,
  };
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}
