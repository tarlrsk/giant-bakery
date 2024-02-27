"use client";

import React from "react";

import {
  User,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";

import DeleteIcon from "../icons/DeleteIcon";

// ----------------------------------------------------------------------

type Props = {
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  onRemoveItem: (item: any) => void;
};

// ----------------------------------------------------------------------

export default function CustomSnackBoxItems({ items, onRemoveItem }: Props) {
  const renderCell = React.useCallback(
    (
      item: {
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
      },
      columnKey: React.Key,
    ) => {
      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{
                radius: "md",
                className: "w-10 h-10 md:w-16 md:h-16",
                src: item.image,
              }}
              classNames={{
                name: "text-sm font-medium items-center",
              }}
              description={`จำนวน: ${item?.quantity || "1"}`}
              name={item.name}
            />
          );

        case "total":
          return (
            <div className="flex flex-row items-center justify-end text-sm">
              {`฿${item.price}`}
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent pb-1.5"
                onPress={() => onRemoveItem(item)}
              >
                <DeleteIcon />
              </Button>
            </div>
          );
        default:
          return "";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Table radius="sm" removeWrapper hideHeader>
      <TableHeader>
        <TableColumn key="name">สินค้า</TableColumn>
        <TableColumn key="total" align="end" className=" text-end">
          ราคารวม
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"ไม่พบสินค้าในกล่อง"} items={items}>
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
