import { prisma } from "@/lib/prisma";
import apiPaths from "@/utils/api-path";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { fetcher } from "@/utils/axios";
import { NextRequest } from "next/server";

type GetPriceParam = {
  params: {
    addressId: string;
    cartId: string;
  };
};

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

export async function GET(req: NextRequest, { params }: GetPriceParam) {
  try {
    const addressId = req.nextUrl.searchParams.get("addressId") as string;
    const cartId = req.nextUrl.searchParams.get("cartId") as string;

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

    const { getInterExpressLocation, getPrice } = apiPaths();

    const res = await fetch(getInterExpressLocation(address.postcode));
    const data = await res.json();

    const res2 = await fetch(getInterExpressLocation("21000"));
    const osgData = await res2.json();
    const filterOsgData = filterDataByNameTh(
      "เนินพระ",
      "เมืองระยอง",
      "ระยอง",
      osgData,
    );

    const filterDesData = filterDataByNameTh(
      address.subdistrict,
      address.district,
      address.province,
      data,
    );

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
          TemperatureTypeId: 8,
          TemperatureControlId: 2,
          PackageCount: 2,
          boxSize: "S1",
          boxDesc: "≤ 5 กก. หรือ ≤ 7,500 ลบ.ซม.",
          Weight: 0,
          Width: 25,
          Length: 20,
          Height: 15,
        },
      ],
    } as Shipment;

    const getPriceRes = await fetch(getPrice(), {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(getPriceBody),
    });
    const getPriceData = await getPriceRes.json();

    return responseWrapper(200, getPriceData, null);
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
