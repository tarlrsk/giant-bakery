import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { customerAddressValidationSchema } from "@/lib/validation-schema";

// ----------------------------------------------------------------------

type GetAddressByCustomerIdProps = {
  params: {
    customerId: string;
  };
};

export async function GET(
  _req: NextRequest,
  { params }: GetAddressByCustomerIdProps,
) {
  try {
    const { customerId } = params;

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return responseWrapper(
        404,
        null,
        `User with given id ${customerId} not found.`,
      );
    }

    const customerAddresses = await prisma.customerAddress.findMany({
      where: { userId: customer.id },
    });

    if (!customerAddresses || customerAddresses.length === 0) {
      return responseWrapper(
        404,
        null,
        `User with given id ${customerId} does not have any addresses.`,
      );
    }

    return responseWrapper(200, customerAddresses, null);
  } catch (err: any) {
    return responseWrapper(500, null, `${err.message}.`);
  }
}

export async function POST(
  req: NextRequest,
  { params }: GetAddressByCustomerIdProps,
) {
  try {
    const { customerId } = params;
    const body = await req.json();
    const validation = customerAddressValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return responseWrapper(
        404,
        null,
        `User with given id ${customerId} not found.`,
      );
    }

    const {
      cFirstName,
      cLastName,
      address,
      district,
      subdistrict,
      province,
      postcode,
      phone,
    } = body;

    const newAddress = await prisma.customerAddress.create({
      data: {
        cFirstName,
        cLastName,
        address,
        district,
        subdistrict,
        province,
        postcode,
        phone,
        userId: customer.id,
      },
    });

    return responseWrapper(201, newAddress, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
