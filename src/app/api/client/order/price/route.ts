import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

type GetPriceParam = {
  params: {
    addressId: string;
    cartId: string;
  };
};

export async function GET(_req: NextRequest, { params }: GetPriceParam) {
  try {
    const { addressId, cartId } = params;

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
