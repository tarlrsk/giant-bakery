"use client";

import { z } from "zod";
import toast from "react-hot-toast";
import paths from "@/utils/api-path";
import React, { useMemo } from "react";
import { ICartItem } from "@/app/cart/types";
import { updateQtyCartValidateSchema } from "@/lib/validationSchema";

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
import DeleteIcon from "../icons/DeleteIcon";

// ----------------------------------------------------------------------

type updateCartProps = z.infer<typeof updateQtyCartValidateSchema>;

type Props = {
  userId: string;
  items: ICartItem[];
};

// ----------------------------------------------------------------------

export default function CartItemTable({ userId, items }: Props) {
  const renderCell = React.useCallback(
    (item: ICartItem, columnKey: React.Key) => {
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
              name={item.name}
              className=" gap-6 pl-3"
            >
              {item.name}
            </User>
          );

        case "price":
          return (
            <div className="justify-center text-center">{`฿${item.pricePer}`}</div>
          );

        case "amount":
          return (
            <div className="flex flex-row items-center gap-1 justify-center">
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent"
                onPress={() =>
                  handleUpdateCartItem(
                    userId,
                    item.itemId,
                    item.type,
                    item.quantity,
                    "increase",
                  )
                }
              >
                <MinusIcon />
              </Button>
              <div className=" border border-gray-300 max-w-12 min-w-12 px-1 text-center overflow-auto text-ellipsis rounded-sm">
                {item.quantity}
              </div>
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent"
                onPress={() =>
                  handleUpdateCartItem(
                    userId,
                    item.itemId,
                    item.type,
                    item.quantity,
                    "decrease",
                  )
                }
              >
                <AddIcon />
              </Button>
            </div>
          );

        case "total":
          return (
            <div className="flex flex-row items-center gap-1 justify-end pr-3">
              {`฿${item.price}`}
              <Button
                isIconOnly
                size="sm"
                radius="md"
                className="bg-transparent pb-1.5"
                onPress={() =>
                  handleUpdateCartItem(
                    userId,
                    item.itemId,
                    item.type,
                    item.quantity,
                    "remove",
                  )
                }
              >
                <DeleteIcon />
              </Button>
            </div>
          );
        default:
          return "";
      }
    },
    [userId],
  );

  const classNames = useMemo(
    () => ({
      th: [
        "bg-primaryT-lighter",
        "font-medium",
        "text-sm md:text-base",
        "border-b",
        "border-divider",
        "px-3 py-4 md:py-4 md:px-8",
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
        <TableColumn key="total" align="end" className=" text-end">
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

async function handleUpdateCartItem(
  userId: string,
  type: string,
  itemId: string,
  quantity: number,
  action: "increase" | "decrease" | "remove",
) {
  const { updateCartItem, deleteCartItem } = paths();

  const updatedQuantity = action === "increase" ? quantity + 1 : quantity - 1;
  const isDeleted = action === "remove" || updatedQuantity === 0;

  try {
    const res = await fetch(
      isDeleted ? deleteCartItem(userId, itemId) : updateCartItem,
      {
        method: isDeleted ? "DELETE" : "PUT",
        body: JSON.stringify({ userId, type, itemId, updatedQuantity }),
      },
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
  }
}
