import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

import { createAddressSchema } from "../../validationSchemas";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return new NextResponse(null, { status: 404, statusText: "Not Found" });

  try {
    const body = await req.json();
    const validation = createAddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newAddress = await prisma.customerAddress.create({
      data: body,
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
