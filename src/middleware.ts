import { NextRequest, NextResponse } from "next/server";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://giantbakery.vercel.app", "https://giantbakery-uat.vercel.app"]
    : ["https://giantbakery-stg.vercel.app", "http://localhost:3000"];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  console.log(origin);

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request.",
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.log(request.method);
  console.log(request.url);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
