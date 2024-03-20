import { prisma } from "@/lib/prisma";
import apiPaths from "@/utils/api-path";
import { NextRequest } from "next/server";
import { calculateBoxQuantity, calculateShippingFee } from "@/lib/interExpress";
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
      discounts: cartData.response.data.discount,
      totalDiscount: cartData.response.data.totalDiscount,
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

      const itemSizes: {
        volume: number,
        weight: number,
      }[] = []

      for (let cartItem of response.items) {
        switch (cartItem.itemType) {
          case "PRESET_CAKE":
            const cake = await prisma.cake.findFirst({
              where: {
                id: cartItem.cakeId
              }
            })
            if (cake) {
              for (let i = 0; i < cartItem.quantity; i++) {
                itemSizes.push({
                  volume: cake.width * cake.height * cake.length,
                  weight: cake.weight,
                })
              }
            }
            break;

          case "CUSTOM_CAKE":
            var weight = 0.0;
            var height = 0.0;
            var length = 0.0;
            var width = 0.0;
            switch (cartItem.size.name) {
              case "1":
                weight = 200;
                height = 20;
                length = 20;
                width = 20;
                break;
              case "2":
                weight = 300;
                height = 20;
                length = 20;
                width = 20;
                break;
              case "3":
                weight = 400;
                height = 20;
                length = 20;
                width = 20;
                break;
            }
            for (let i = 0; i < cartItem.quantity; i++) {
              itemSizes.push({
                volume: width * height * length,
                weight: weight,
              })
            }
            break;

          case "REFRESHMENT":
            for (let i = 0; i < cartItem.quantity; i++) {
              itemSizes.push({
                volume: cartItem.width * cartItem.height * cartItem.length,
                weight: cartItem.weight,
              })
            }
            break;

          case "SNACK_BOX":
            var weight = 0.0;
            var height = 0.0;
            var length = 0.0;
            var width = 0.0;
            switch (cartItem.packageType) {
              case "PAPER_BAG":
                weight = 200;
                height = 20;
                length = 20;
                break;
              case "SNACK_BOX_S":
                weight = 300;
                height = 20;
                length = 20;
                break;
              case "SNACK_BOX_M":
                weight = 400;
                height = 20;
                length = 20;
                break;
            }
            for (var refreshment of cartItem.refreshments) {
              weight += refreshment.refreshment.weight
            }
            for (let i = 0; i < cartItem.quantity; i++) {
              itemSizes.push({
                volume: width * height * length,
                weight: weight,
              })
            }
            break;
        }
      }

      const boxes = await calculateBoxQuantity(itemSizes)
      response.shippingFee = await calculateShippingFee(address, boxes);
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
