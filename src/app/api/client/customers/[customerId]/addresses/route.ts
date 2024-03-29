import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { validate as isValidUUID } from "uuid";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { customerAddressValidationSchema } from "@/lib/validationSchema";

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
        200,
        [],
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

export async function PUT(
  req: NextRequest,
  { params }: GetAddressByCustomerIdProps,
) {
  try {
    const { customerId } = params;

    if (!isValidUUID(customerId)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const body = await req.json();

    const {
      addressId,
      cFirstName,
      cLastName,
      address,
      district,
      subdistrict,
      province,
      postcode,
      phone,
    } = body;

    if (!isValidUUID(addressId)) {
      return responseWrapper(400, null, "Invalid uuid.");
    }

    const validation = customerAddressValidationSchema.safeParse(body);

    if (!validation.success) {
      return responseWrapper(400, null, validation.error.format());
    }

    const customerAddresses = await prisma.customerAddress.findMany({
      where: { userId: customerId },
    });

    if (!customerAddresses) {
      return responseWrapper(200, null, null);
    }

    const cAddress = customerAddresses.find(
      (address) => address.id === addressId,
    );

    if (!cAddress) {
      return responseWrapper(
        404,
        null,
        `Addresss with given id ${addressId} not found.`,
      );
    }

    const updatedAddress = await prisma.customerAddress.update({
      where: { id: addressId },
      data: {
        cFirstName: cFirstName,
        cLastName: cLastName,
        address: address,
        district: district,
        subdistrict: subdistrict,
        province: province,
        postcode: postcode,
        phone: phone,
      },
    });

    return responseWrapper(200, updatedAddress, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: GetAddressByCustomerIdProps,
) {
  try {
    const { customerId } = params;

    if (!isValidUUID(customerId)) {
      return responseWrapper(400, null, "Invalid uuidid.");
    }

    const body = await _req.json();

    const { addressId } = body;

    if (!isValidUUID(addressId)) {
      return responseWrapper(400, null, "Invalid uuidid.");
    }

    const customerAddresses = await prisma.customerAddress.findMany({
      where: { userId: customerId },
    });

    if (!customerAddresses) {
      return responseWrapper(200, null, null);
    }

    const address = customerAddresses.find(
      (address) => address.id === addressId,
    );

    if (!address) {
      return responseWrapper(
        404,
        null,
        `Addresss with given id ${addressId} not found.`,
      );
    }

    await prisma.customerAddress.delete({
      where: { id: addressId },
    });

    return responseWrapper(200, null, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
