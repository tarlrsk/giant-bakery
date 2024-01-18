"use client";

import React, { useMemo } from "react";

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

type RowItem = {
  name: string;
  imageUrl: string;
  description: string;
  amount: number;
  price: number;
  totalPrice: number;
};

type Props = {
  items: RowItem[];
};

export default function CartItemTable({ items }: Props) {
  const renderCell = React.useCallback(
    (item: RowItem, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof RowItem];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{
                radius: "md",
                className: "w-14 h-14 md:w-20 md:h-20 md:text-large",
                src: item.imageUrl,
              }}
              classNames={{
                name: "text-sm md:text-lg font-medium",
                description: "text-xs md:text-base font-normal",
              }}
              description={item.description}
              name={cellValue}
              className=" gap-6"
            >
              {item.name}
            </User>
          );

        case "price":
          return <div className="">{`฿${item.price}`}</div>;

        case "total":
          return `฿${item.totalPrice}`;
        default:
          return cellValue;
      }
    },
    [],
  );

  const classNames = useMemo(
    () => ({
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
        "text-base",
        // changing the rows border radius
        // first
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
        <TableColumn key="name">สินค้า</TableColumn>
        <TableColumn key="price">ราคา</TableColumn>
        <TableColumn key="amount">จำนวน</TableColumn>
        <TableColumn key="total">ราคารวม</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No items found"} items={items}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
