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

export default function CartSummaryTable() {
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
    <Table radius="sm" removeWrapper classNames={classNames}>
      <TableHeader>
        <TableColumn key="name">สรุปคำสั่งซื้อ</TableColumn>
        <TableColumn key="price" align="end">
          {""}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"ไม่พบสินค้า"}>
        <TableRow key="1">
          <TableCell className="text-sm md:text-lg font-medium">
            ราคาสินค้ารวม:
          </TableCell>
          <TableCell className="relative flex justify-end mb-4 text-sm md:text-lg">
            ฿305
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell className="text-sm md:text-lg font-medium">
            ส่วนลด:
          </TableCell>
          <TableCell className="relative flex justify-end  mb-4 text-sm md:text-lg">
            ฿0{" "}
          </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell className="text-sm md:text-lg font-medium">
            ยอดรวม:
          </TableCell>
          <TableCell className="relative flex justify-end  mb-4 text-sm md:text-lg">
            ฿305
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
