import { NextRequest } from "next/server";
import { prismaOrder } from "@/persistence/order";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const orders = await prismaOrder().getAllOrder();

    return responseWrapper(200, orders, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
