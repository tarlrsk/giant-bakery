"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { fCurrency } from "@/utils/format";
import { ICartItem } from "@/app/(client)/cart/types";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@nextui-org/react";

import {
  isCustomSnackBox,
  getCakeStaticVariantsString,
  getCustomSnackBoxItemsString,
} from "./CartItemTable";

// ----------------------------------------------------------------------

type Props = {
  checkoutDetail:
    | {
        items: ICartItem[];
        subTotal: number;
        discounts: { name: string; discount: number }[];
        totalDiscount: number;
        shippingFee: number;
        total: number;
      }
    | undefined;
  className?: string;
};

// ----------------------------------------------------------------------

export default function CheckoutSummaryTable({
  checkoutDetail,
  className,
}: Props) {
  const items = checkoutDetail?.items || [];
  const total: number = checkoutDetail?.total || 0;
  const subTotal: number = checkoutDetail?.subTotal || 0;
  const totalDiscount: number = checkoutDetail?.totalDiscount || 0;
  const shippingFee: number = checkoutDetail?.shippingFee || 0;

  const classNames = useMemo(
    () => ({
      wrapper: ["rounded-sm"],
      th: [
        "bg-transparent",
        "font-normal",
        "text-base text-primaryT-darker md:text-xl",
        "border-b",
        "border-divider",
        "px-3 pb-4 pt-2 md:pb-5 md:pt-3",
        "first:rounded-l-md last:rounded-r-md last:text-end last:text-sm last:md:text-base",
      ],
    }),
    [],
  );

  const renderItemCell = React.useCallback(
    (item: ICartItem | any, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          if (item.name === null) return;
          if (!!item?.image || item.type === "CUSTOM") {
            return (
              <div className=" flex flex-col gap-0">
                <div className="text-sm md:text-base">
                  {`${item?.quantity ? `x${item.quantity}` : "ss"} ${
                    item.itemType === "CUSTOM_CAKE"
                      ? "เค้กออกแบบเอง"
                      : isCustomSnackBox(item)
                        ? "ชุดเบรกจัดเอง"
                        : item.name
                  }`}
                </div>
                {item.itemType === "CUSTOM_CAKE" ||
                  (item.itemType === "PRESET_CAKE" && (
                    <div className="text-xs text-gray-400  md:text-sm">
                      {getCakeStaticVariantsString(item)}
                    </div>
                  ))}
                {isCustomSnackBox(item) && (
                  <div className="text-xs text-gray-400  md:text-sm">
                    {getCustomSnackBoxItemsString(item)}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div
                className={`text-base md:text-lg ${
                  item.itemId === "total" ? "font-medium" : ""
                }`}
              >
                {item.name}
              </div>
            );
          }
        case "price":
          return (
            <div
              className={`text-end ${
                item.itemId === "total" ? "font-medium" : ""
              }`}
            >{`${item.itemId === "totalDiscount" ? "-" : ""}฿${fCurrency(
              item.price,
            )}`}</div>
          );
        default:
          return "";
      }
    },
    [],
  );

  const summaryData = [
    { itemId: "subTotal", name: "ราคาสินค้ารวม", price: subTotal },
    shippingFee
      ? { itemId: "shippingFee", name: "ค่าจัดส่ง", price: shippingFee }
      : null,
    totalDiscount
      ? { itemId: "totalDiscount", name: "ส่วนลด", price: totalDiscount }
      : null,
    { itemId: "total", name: "ยอดรวม", price: total },
  ];

  return (
    <Table radius="none" classNames={classNames} className={className}>
      <TableHeader>
        <TableColumn key="name">สรุปคำสั่งซื้อ</TableColumn>
        <TableColumn key="price" align="end">
          <Link href="/cart" className=" underline">
            แก้ไขตะกร้า
          </Link>
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"ไม่พบสินค้า"}
        items={[...items, ...summaryData]}
      >
        {(item) =>
          item ? (
            <TableRow key={item.itemId}>
              {(columnKey) => (
                <TableCell className="text-sm md:text-base">
                  {renderItemCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          ) : (
            <></>
          )
        }
      </TableBody>
    </Table>
  );
}
