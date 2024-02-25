import { responseWrapper } from "@/utils/api-response-wrapper";
import { NextRequest } from "next/server";

type GetOrderById = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: GetOrderById) {
  try {
    const { id } = params;
    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err);
  }
}
