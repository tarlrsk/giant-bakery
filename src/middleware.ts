import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://giantbakery.vercel.app", "https://giantbakery-uat.vercel.app"]
    : ["https://giantbakery-stg.vercel.app", "http://localhost:3000"];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const origin = req.headers.get("origin");

    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse(null, {
        status: 400,
        statusText: "Bad Request.",
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (
      (req.nextUrl.pathname.startsWith("/api/admin") ||
        req.nextUrl.pathname.startsWith("/admin")) &&
      req.nextauth.token?.role !== "ADMIN"
    )
      return NextResponse.rewrite(new URL("/denied", req.url));

    console.log(req.method);
    console.log(req.url);
  },
  {
    callbacks: {
      authorized: async ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
