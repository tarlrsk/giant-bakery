import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://cukedoh.vercel.app/"]
    : [
        "https://cukedoh-uat.vercel.app",
        "https://cukedoh-stg.vercel.app",
        "http://localhost:3000",
      ];

export let userId: string | undefined = undefined;

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const origin = req.headers.get("origin");
    userId = req.nextauth.token?.id;

    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse(null, {
        status: 400,
        statusText: "Bad Request.",
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (
      (req.nextUrl.pathname.startsWith("/api/portal") ||
        req.nextUrl.pathname.startsWith("/admin")) &&
      req.nextauth.token?.role !== "ADMIN"
    )
      return NextResponse.redirect(req.nextUrl.origin);

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
  matcher: ["/api/portal/:path*", "/admin/:path*"],
};
