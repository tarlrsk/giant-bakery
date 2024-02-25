import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";

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
