import { prisma } from "@/lib/prisma";
import apiPaths from "@/utils/api-path";
import { NextRequest } from "next/server";
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
    const addressId = req.nextUrl.searchParams.get("addressId") as string;
    const userId = req.nextUrl.searchParams.get("userId") as string;

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
          name: "ลดทั้งหมดแม่ง",
          discount: 10,
        },
      ],
      totalDiscount: 10,
    } as TotalPriceResponse;

    // Get Destination Location
    const res = await fetch(getInterExpressLocation(address.postcode));
    const data = await res.json();
    const filterDesData = filterDataByNameTh(
      address.subdistrict,
      address.district,
      address.province,
      data,
    );

    // Get Osg Location
    const osgRes = await fetch(getInterExpressLocation("21000"));
    const osgData = await osgRes.json();
    const filterOsgData = filterDataByNameTh(
      "เนินพระ",
      "เมืองระยอง",
      "ระยอง",
      osgData,
    );

    // Map Get InterExpressPrice Body
    const getPriceBody = {
      orgSubDistricts: filterOsgData.subDistricts.id,
      orgDistrict: filterOsgData.districts.id,
      orgProvince: filterOsgData.provinces.id,
      destDistrict: filterOsgData.districts.id,
      destSubDistricts: filterOsgData.subDistricts.id,
      destProvince: filterOsgData.provinces.id,
      totalPackage: null,
      orgPostCode: "21000",
      orgZoneId: filterOsgData.zoneDesc.id,
      destPostCode: address.postcode,
      destZoneId: filterDesData.zoneDesc.id,
      ItmsCustomerId: "0000000000000",
      ItmsDcCode: filterDesData.subDistricts.dcCodeItms,
      ItmsProvinceCode: filterDesData.subDistricts.provinceCodeItms,
      ItmsDistrictCode: filterDesData.subDistricts.districtCodeItms,
      PostalCode: address.postcode,
      PaymentCode: "CR",
      BoxDetails: [
        {
          ServiceId: 2,
          ServiceControlId: 5,
          TemperatureTypeId: 1,
          TemperatureControlId: 2,
          PackageCount: 1,
          boxSize: "S1",
          boxDesc: "≤ 5 กก. หรือ ≤ 7,500 ลบ.ซม.",
          Weight: 0,
          Width: 25,
          Length: 20,
          Height: 15,
        },
      ],
    } as Shipment;

    // Fetch InterExpress Get Price API
    const getPriceRes = await fetch(getPrice(), {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(getPriceBody),
    });
    const getPriceData = await getPriceRes.json();
    response.shippingFee = getPriceData.reduce(
      (sum: any, box: any) => sum + box.totalRate,
      0,
    );

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
