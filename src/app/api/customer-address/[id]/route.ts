import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// ----------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const uid: string = params.id;
  try {
    const userAddresses = await prisma.customerAddress.findUnique({
      // TODO: This should be userId, currently it is addressId which is only for testing purposes
      // where: { userId: uid},
      where: { id: uid },
    });
    return NextResponse.json(userAddresses);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const addressId: string = params.id;

  try {
    const body = await req.json();

    const updated = await prisma.customerAddress.update({
      where: { id: addressId },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const addressId: string = params.id;

  try {
    const deleted = await prisma.customerAddress.delete({
      where: { id: addressId },
    });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
