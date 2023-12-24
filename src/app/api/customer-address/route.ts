import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createAddressSchema } from "./types";

// ----------------------------------------------------------------------

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return new NextResponse(null, { status: 404, statusText: "Not Found" });

  try {
    const { address, district, subDistrict, province, code, phone } =
      await req.json();

    // const newAddress = await prisma.customerAddress.create({
    //     data: {address, district, subDistrict, province, code, phone}
    // })

    console.log("req:", address, district, subDistrict, province, code);

    return NextResponse.json({ message: "Successful" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred while signing up." },
      { status: 500 },
    );
  }
}
