"use client";

import React, { useMemo } from "react";

import {
  User,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@nextui-org/react";

import AddIcon from "../icons/AddIcon";
import MinusIcon from "../icons/MinusIcon";

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

// ----------------------------------------------------------------------

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
          return (
            <div className="justify-center text-center">{`฿${item.price}`}</div>
          );

        case "amount":
          return (
            <div className="flex flex-row items-center gap-1 justify-center">
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent"
                onPress={() => onDecreaseItem(item.name)}
              >
                <MinusIcon />
              </Button>
              <div className=" border border-gray-300 max-w-12 min-w-12 px-1 text-center overflow-auto text-ellipsis rounded-sm">
                {item.amount}
              </div>
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent"
                onPress={() => onIncreaseItem(item.name)}
              >
                <AddIcon />
              </Button>
            </div>
          );

        case "total":
          return (
            <div className="justify-center text-center">
              {`฿${item.totalPrice}`}
            </div>
          );
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
        <TableColumn key="price" className="text-center">
          ราคา
        </TableColumn>
        <TableColumn key="amount" align="center" className="text-center">
          จำนวน
        </TableColumn>
        <TableColumn key="total" className="text-center">
          ราคารวม
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"ไม่พบสินค้าในตะกร้า"} items={items}>
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

// ----------------------------------------------------------------------

async function onIncreaseItem(itemId: string) {
  console.log("Increase");
}

async function onDecreaseItem(itemId: string) {
  console.log("Decrease");
}

async function onRemoveItem(itemId: string) {
  console.log("Remove");
}
