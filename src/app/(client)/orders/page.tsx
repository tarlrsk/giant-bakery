"use client";

import useSWR from "swr";
import { Order } from "@prisma/client";
import React, { useMemo } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";

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
    key: "totalPrice",
    label: "ยอดชำระ",
  },
  {
    key: "paymentType",
    label: "ประเภทการชำระ",
  },
  {
    key: "status",
    label: "สถานะคำสั่งซื้อ",
  },
];

export default function OrdersPage() {
  const router = useRouter();
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
    <>
      <div className="px-40 font-semibold text-4xl pt-20 pb-10">
        ออเดอร์ของฉัน
      </div>
      <div className="px-40 pb-20">
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
                  <TableCell
                    className="text-md py-8 hover:cursor-pointer"
                    onClick={() => {
                      router.push(`orders/${item.id}`);
                    }}
                  >
                    {columnKey === "orderedAt"
                      ? formatDate(item.orderedAt.toString())
                      : getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
