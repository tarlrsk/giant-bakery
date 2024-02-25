"use client";

import useSWR from "swr";
import { Order } from "@prisma/client";
import React, { useMemo } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  getKeyValue,
} from "@nextui-org/react";

const columns = [
  {
    key: "id",
    label: "หมายเลขออเดอร์",
  },
  {
    key: "orderedAt",
    label: "วันที่สั่งซื้อ",
  },
  {
    key: "subTotalPrice",
    label: "ยอดชำระ",
  },
  {
    key: "type",
    label: "ประเภทการชำระ",
  },
  {
    key: "status",
    label: "สถานะคำสั่งซื้อ",
  },
];

const rows = [
  {
    key: "1",
    id: "RT00001",
    orderedAt: "2024-02-23 03:05:44.962",
    subTotalPrice: 29.99,
    type: "SINGLE",
    status: "DONE",
  },
  {
    key: "2",
    id: "WH00001",
    orderedAt: "2024-02-23 03:05:44.962",
    subTotalPrice: 29.99,
    type: "INSTALLMENT",
    status: "PROCESSING",
  },
];

export default function OrdersPage() {
  const { getOrderList } = apiPaths();

  const { data } = useSWR(getOrderList, fetcher);

  const items: Order[] = data?.response?.data || [];

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: [
        "bg-transparent",
        "font-medium",
        "text-sm md:text-xl",
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
    <div className="px-40 py-20">
      <Table
        radius="lg"
        removeWrapper
        selectionMode="single"
        classNames={classNames}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"ไม่มีออเดอร์"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="text-md py-8 hover:cursor-pointer">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
