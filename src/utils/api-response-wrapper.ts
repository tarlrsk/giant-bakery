import { NextResponse } from "next/server";

// ----------------------------------------------------------------------

interface APIResponse {
  success: boolean;
  status?: number | 500;
  message?: string;
  data?: any;
  error?: string | object;
}

// ----------------------------------------------------------------------

export const responseWrapper = (
  statusCode: number,
  data: any | null,
  error: string | object | null,
) => {
  const response: APIResponse = {
    success: !error,
  };

  response.status = statusCode;

  if (error) {
    switch(statusCode){
      case 500:
        response.message = "Something Went Wrong";
        break;
      case 400:
        response.message = "Bad Request";
        break;
      case 404:
        response.message = "Not Found";
        break;
      case 409:
        response.message = "Conflict";
        break;
    }
    response.error = error;
  } else {
    response.message = "Success";
    response.data = data;
  }

  return NextResponse.json({ response }, { status: statusCode });
};
