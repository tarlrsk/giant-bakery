import { prisma } from "@/lib/prisma";
import apiPaths from "@/utils/api-path";
import { NextRequest } from "next/server";
import { calculateShippingFee } from "@/lib/interExpress";
import { responseWrapper } from "@/utils/api-response-wrapper";

type BoxDetails = {
  ServiceId: number;
  ServiceControlId: number;
  TemperatureTypeId: number;
  TemperatureControlId: number;
  PackageCount: number;
  boxSize: string;
  boxDesc: string;
  Weight: number;
  Width: number;
  Length: number;
  Height: number;
};

type Shipment = {
  orgSubDistricts: number;
  orgDistrict: number;
  orgProvince: number;
  destDistrict: number;
  destSubDistricts: number;
  destProvince: number;
  totalPackage: null;
  orgPostCode: string;
  orgZoneId: number;
  destPostCode: string;
  destZoneId: number;
  ItmsCustomerId: string;
  ItmsDcCode: string;
  ItmsProvinceCode: string;
  ItmsDistrictCode: string;
  PostalCode: string;
  PaymentCode: string;
  BoxDetails: BoxDetails[];
};

type TotalPriceResponse = {
  items: any[];
  subTotal: number;
  shippingFee: number;
  discounts: Discounts[];
  totalDiscount: number;
  total: number;
};

type Discounts = {
  name: string;
  discount: number;
};

export async function GET(req: NextRequest) {
  try {
    const addressId = req.nextUrl.searchParams.get("addressId") as
      | string
      | null;
    const userId = req.nextUrl.searchParams.get("userId") as string;

    const { getInterExpressLocation, getPrice, getCart } = apiPaths();
    // Get CartData
    const cartRes = await fetch(getCart(userId));
    const cartData = await cartRes.json();
    const response = {
      items: cartData.response.data.items,
      subTotal: cartData.response.data.subTotal,
      // TODO DISCOUNTS
      discounts: [
        {
          name: "ร้านกำลังอยู่ในช่วงพัฒนา ลดให้เลย 10 บาท",
          discount: 10,
        },
        {
          name: "พอดีเป็นคนใจดีน่ะ ลดให้เลย 10 บาท",
          discount: 10,
        },
      ],
      totalDiscount: 20,
      shippingFee: 0,
    } as TotalPriceResponse;

    if (addressId && addressId != "") {
      const address = await prisma.customerAddress.findFirst({
        where: {
          id: addressId,
        },
      });

      if (!address) {
        return responseWrapper(
          404,
          null,
          `Address with addressId ${addressId} is not found.`,
        );
      }

      response.shippingFee = await calculateShippingFee(address);
    }

    response.total =
      response.subTotal + response.shippingFee - response.totalDiscount;

    return responseWrapper(200, response, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}

function filterDataByNameTh(
  subDistrictName: string,
  districtName: string,
  provinces: string,
  data: any,
): { zoneDesc: any; subDistricts: any; districts: any; provinces: any } {
  const filteredSubDistricts = data.subDistricts.filter(
    (subDistrict: { names: { th: string } }) =>
      subDistrict.names.th === subDistrictName,
  );
  const filteredDistricts = data.district.filter(
    (district: { names: { th: string } }) => district.names.th === districtName,
  );
  const filteredProvinces = data.province.filter(
    (province: { names: { th: string } }) => province.names.th === provinces,
  );
  return {
    zoneDesc: data.zoneDesc,
    subDistricts: filteredSubDistricts[0],
    districts: filteredDistricts[0],
    provinces: filteredProvinces[0],
  };
}
