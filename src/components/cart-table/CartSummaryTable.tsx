"use client";

import React, { useMemo } from "react";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@nextui-org/react";

// ----------------------------------------------------------------------

type Props = {
  subTotal: number;
  discounts: { name: string; discount: number }[];
  totalDiscount: number;
  total: number;
};

// ----------------------------------------------------------------------

export default function CartSummaryTable({
  subTotal,
  discounts,
  totalDiscount,
  total,
}: Props) {
  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: [
        "bg-primaryT-lighter",
        "font-medium",
        "text-sm md:text-base",
        "border-b",
        "border-divider",
        "px-3 py-4 md:py-4",
        "first:rounded-none first:rounded-none",
        "last:rounded-none last:rounded-none",
      ],
      td: [
        // changing the rows border radius
        // first
        "text-base",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table radius="sm" removeWrapper isCompact classNames={classNames}>
      <TableHeader>
        <TableColumn className=" text-primaryT-darker" key="name">
          สรุปคำสั่งซื้อ
        </TableColumn>
        <TableColumn key="price" align="end">
          {""}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"ไม่พบสินค้า"}>
        <TableRow key="1">
          <TableCell className="text-sm md:text-lg font-medium">
            ราคาสินค้า
          </TableCell>
          <TableCell className="relative flex justify-end mb-4 text-sm md:text-lg">
            {`฿${subTotal}`}
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell className="text-sm md:text-lg font-medium">
            <div className=" flex flex-col">
              <div>ส่วนลด</div>
              {discounts.map((discount, index) => {
                return (
                  <p key={index} className=" text-sm font-normal text-gray-500">
                    {discount.name}
                  </p>
                );
              })}
            </div>
          </TableCell>
          <TableCell className="relative flex justify-end  mb-4 text-sm md:text-lg">
            <div className=" flex flex-col">
              <div> {`-฿${totalDiscount}`}</div>
            </div>
          </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell className="text-sm md:text-lg font-medium text-secondaryT-main">
            ยอดรวม
          </TableCell>
          <TableCell className="relative flex justify-end  mb-4 text-sm md:text-lg font-medium text-secondaryT-main">
            {`฿${total}`}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
