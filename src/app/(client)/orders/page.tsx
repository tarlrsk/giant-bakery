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

import { getStatus, IOrderDetail } from "./types";

// ----------------------------------------------------------------------

const columns = [
  {
    key: "orderNo",
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
    key: "displayPaymentType",
    label: "ประเภทการชำระ",
  },
  {
    key: "displayStatus",
    label: "สถานะคำสั่งซื้อ",
  },
];

// ----------------------------------------------------------------------

export default function OrdersPage() {
  const router = useRouter();
  const { getOrderList } = apiPaths();

  const { data } = useSWR(getOrderList, fetcher);

  const items: Order[] = data?.response?.data || [];

  const classNames = useMemo(
    () => ({
      // wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: [
        "bg-transparent",
        "font-medium",
        "text-xs md:text-medium",
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

  const formattedItems = items?.map((item) => ({
    ...item,
    displayPaymentType:
      item.paymentType === "SINGLE"
        ? ("ชำระเต็มจำนวน" as any)
        : ("จ่ายมัดจำ" as any),
    displayStatus: getStatus(item as unknown as IOrderDetail),
  }));

  return (
    <div className="container">
      <div className=" pb-6 pt-12 text-2xl font-semibold md:pb-10 md:pt-20 md:text-4xl">
        ออเดอร์ของฉัน
      </div>
      <div className=" pb-20">
        <Table radius="lg" classNames={classNames}>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"ไม่มีออเดอร์"} items={formattedItems}>
            {(item) => (
              <TableRow
                key={item.id}
                onClick={() => {
                  router.push(`orders/${item.id}`);
                }}
                className=" hover:bg-gray-100 "
              >
                {(columnKey) => (
                  <TableCell
                    className={`py-2 text-xs hover:cursor-pointer md:py-8 md:text-medium ${
                      columnKey === "displayStatus" &&
                      (item.status === "PENDING_PAYMENT1" ||
                        item.status === "PENDING_PAYMENT2") &&
                      "text-yellow-600"
                    } ${
                      columnKey === "displayStatus" &&
                      item.status === "COMPLETED" &&
                      "text-green-600"
                    } ${item.isCancelled && "!text-red-600"}`}
                  >
                    {columnKey === "orderedAt"
                      ? formatDate(item.orderedAt.toString())
                      : getKeyValue(item, columnKey) || "-"}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
