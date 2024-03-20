import apiPaths from "@/utils/api-path";
import { CustomerAddress } from "@prisma/client";

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

type Box = {
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

const boxes: Box[] = [
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
  {
    ServiceId: 2,
    ServiceControlId: 4,
    TemperatureTypeId: 2,
    TemperatureControlId: 2,
    PackageCount: 1,
    boxSize: "S2",
    boxDesc: "≤ 10 กก. หรือ ≤ 15,000 ลบ.ซม.",
    Weight: 5,
    Width: 23,
    Length: 30,
    Height: 20,
  },
];

type ItemDetail = {
  volume: number;
  weight: number;
};

export async function calculateBoxQuantity(
  itemDetails: ItemDetail[],
): Promise<Box[]> {
  let currentBoxSize = "S1";
  let volumeLeft = 7500;
  let weightLeft = 500;
  let resultBoxes: Box[] = [];
  let itemLeft = itemDetails.length;
  for (let item of itemDetails) {
    itemLeft -= 1;
    if (volumeLeft >= item.volume && weightLeft >= item.weight) {
      // IF THERE IS SPACE LEFT
      volumeLeft -= item.volume;
      weightLeft -= item.weight;
      if ((itemLeft = 0)) {
        // IF THIS IS LAST ITEM
        let box = boxes.find((b) => b.boxSize === currentBoxSize);
        if (box) {
          resultBoxes.push(box);
        }
      }
    } else {
      // NO SPACE LEFT
      if (currentBoxSize === "S1") {
        currentBoxSize = "S2"; // UP SIZE IF IT IS THE SMALLEST
        volumeLeft += 7500;
        weightLeft += 500;
      } else if (currentBoxSize === "S2" && itemLeft > 0) {
        // ADD MORE BOX IF IT IS THE LARGEST
        let box = boxes.find((b) => b.boxSize === "S2");
        if (box) {
          resultBoxes.push(box);
        }
        currentBoxSize = "S1";
        volumeLeft = 7500;
        weightLeft = 500;
      }
    }
  }
  return resultBoxes;
}

export async function calculateShippingFee(
  address: CustomerAddress,
): Promise<number> {
  let shippingFee = 0;
  const { getInterExpressLocation, getPrice } = apiPaths();

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
  shippingFee = getPriceData.reduce(
    (sum: any, box: any) => sum + box.totalRate,
    0,
  );
  return shippingFee;
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
