"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { ICartItem } from "@/app/(client)/cart/types";

import {
  User,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@nextui-org/react";

// ----------------------------------------------------------------------

const MOCKUP_ITEMS: ICartItem[] = [
  {
    name: "เอแคลร์",
    image:
      "https://image.makewebeasy.net/makeweb/m_1920x0/Ub8wb5z91/Homemadebakery2022/14_%E0%B9%80%E0%B8%AD%E0%B9%81%E0%B8%84%E0%B8%A5%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B8%B2%E0%B9%82%E0%B8%AE%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%94.jpg",
    description: "ไส้นมฮอกไกโด",
    quantity: 2,
    pricePer: 49,
    price: 98,
    itemId: "test",
    type: "test",
    createdAt: "test",
  },
];

// ----------------------------------------------------------------------

export default function CheckoutSummaryTable() {
  const hasDiscount = false;
  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-lg", "rounded-sm"],
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
          if (!!item?.imageUrl) {
            return (
              <User
                avatarProps={{
                  radius: "md",
                  className: "w-10 h-10 md:w-14 md:h-14 md:text-large",
                  src: item.imageUrl,
                }}
                classNames={{
                  name: "text-sm md:text-base",
                  description: "text-xs md:text-sm",
                }}
                description={item.description}
                name={`${item?.quantity ? `x${item.quantity}` : ""} ${
                  item.name
                }`}
                className=" gap-4"
              />
            );
          } else {
            return <div className="text-base md:text-lg">{item.name}</div>;
          }
        case "price":
          return <div className="text-end">{`฿${item.pricePer}`}</div>;
        default:
          return "";
      }
    },
    [],
  );

  const summaryData = [
    { name: "ราคาสินค้ารวม", pricePer: 305 },
    { name: "ค่าจัดส่ง", pricePer: 49 },
    hasDiscount ? { name: "ส่วนลด", pricePer: 40 } : null,
    { name: "ยอดรวม", pricePer: 354 },
  ];

  return (
    <Table radius="none" classNames={classNames}>
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
        items={[...MOCKUP_ITEMS, ...summaryData]}
      >
        {(item) =>
          item ? (
            <TableRow key={item.name}>
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

        {/* <TableRow key="productCost">
          <TableCell className="text-base md:text-lg">ราคาสินค้ารวม</TableCell>
          <TableCell className="relative flex justify-end text-base md:text-lg">
            ฿305
          </TableCell>
        </TableRow>
        <TableRow key="deliveryCost">
          <TableCell className="text-base md:text-lg">ค่าจัดส่ง</TableCell>
          <TableCell className="relative flex justify-end text-base md:text-lg">
            ฿49
          </TableCell>
        </TableRow>
        {(hasDiscount as any) && (
          <TableRow key="discount">
            <TableCell className="text-base md:text-lg font-medium">
              ส่วนลด
            </TableCell>
            <TableCell className="relative flex justify-end text-base md:text-lg">
              ฿0{" "}
            </TableCell>
          </TableRow>
        )}
        <TableRow key="summaryCost">
          <TableCell className="text-base md:text-lg font-medium">
            ยอดรวม
          </TableCell>
          <TableCell className="relative flex justify-end font-medium text-base md:text-lg">
            ฿354
          </TableCell>
        </TableRow> */}
      </TableBody>
    </Table>
  );
}
