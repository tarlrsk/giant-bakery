import { NextRequest } from "next/server";
import { prismaUser } from "@/persistence/user";
import { prismaOrder } from "@/persistence/order";
import getCurrentUser from "@/actions/userActions";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(req: NextRequest) {
  try {
    const userId = (await getCurrentUser())?.id;
    if (!userId) {
      return responseWrapper(400, null, "UserId is required");
    }

    const user = await prismaUser().getUserById(userId);
    if (!user) {
      return responseWrapper(404, null, `User with ID ${userId} is not found`);
    }

    const orders = await prismaOrder().getAllOrderByUserId(userId);

    return responseWrapper(200, orders, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
