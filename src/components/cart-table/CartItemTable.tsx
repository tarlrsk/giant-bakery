"use client";

import Image from "next/image";
import { ICartItem } from "@/app/(client)/cart/types";
import React, { useMemo, useState, useEffect } from "react";

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

import AddIcon from "../icons/AddIcon";
import MinusIcon from "../icons/MinusIcon";
import DeleteIcon from "../icons/DeleteIcon";

// ----------------------------------------------------------------------

type Props = {
  userId: string;
  userType: "CUSTOMER" | "GUEST";
  items: ICartItem[];
  onUpdateCartItem: (
    userId: string,
    itemId: string,
    type: "CUSTOMER" | "GUEST",
    quantity: number,
    action: "increase" | "decrease" | "remove" | "replace",
  ) => Promise<any>;
};

// ----------------------------------------------------------------------

export default function CartItemTable({
  userId,
  userType,
  items,
  onUpdateCartItem,
}: Props) {
  const [tempItems, setTempItems] = useState(items);

  const classNames = useMemo(
    () => ({
      wrapper: ["p-0"],
      th: [
        "bg-primaryT-lighter",
        "font-medium",
        "text-xs md:text-base",
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

  const handleTempQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedItems = tempItems.map((item) => {
      if (item.itemId === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setTempItems(updatedItems);
  };

  const handleDecrease = async (itemId: string, currentQuantity: number) => {
    try {
      await onUpdateCartItem(
        userId,
        itemId,
        userType,
        currentQuantity,
        "decrease",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrease = async (itemId: string, currentQuantity: number) => {
    try {
      await onUpdateCartItem(
        userId,
        itemId,
        userType,
        currentQuantity,
        "increase",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleQualityChange = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    try {
      await onUpdateCartItem(
        userId,
        itemId,
        userType,
        currentQuantity,
        "replace",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (itemId: string, currentQuantity: number) => {
    try {
      await onUpdateCartItem(
        userId,
        itemId,
        userType,
        currentQuantity,
        "remove",
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setTempItems(items);
  }, [items]);

  return (
    <Table
      radius="sm"
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      classNames={classNames}
    >
      <TableHeader>
        <TableColumn className="text-primaryT-darker" key="name">
          สินค้า
        </TableColumn>
        <TableColumn key="price" className="text-center text-primaryT-darker">
          ราคา
        </TableColumn>
        <TableColumn
          key="amount"
          align="center"
          className="text-center text-primaryT-darker"
        >
          จำนวน
        </TableColumn>
        <TableColumn
          key="total"
          align="end"
          className=" text-center text-primaryT-darker md:text-end"
        >
          ราคารวม
        </TableColumn>
      </TableHeader>
      <TableBody
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        emptyContent={"ไม่พบสินค้าในตะกร้า"}
      >
        {tempItems.map((item) => {
          return (
            <TableRow
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              key={item.itemId}
            >
              <TableCell>
                {item.itemType === "CUSTOM_CAKE" ? (
                  <div className="flex flex-row items-center gap-2 md:gap-6 md:pl-3">
                    <div className=" relative h-10 w-10 rounded-sm border-1 md:h-20 md:w-20">
                      {item.cream?.image && (
                        <Image
                          src={item.cream.image}
                          alt={item?.name}
                          fill
                          className=" z-10 object-cover"
                        />
                      )}
                      {item.topEdge?.image && (
                        <Image
                          src={item.topEdge.image}
                          alt={item?.name}
                          fill
                          className=" z-20 object-cover"
                        />
                      )}
                      {item.decoration?.image && (
                        <Image
                          src={item.decoration.image}
                          alt={item?.name}
                          fill
                          className=" z-30 object-cover"
                        />
                      )}
                      {item.bottomEdge?.image && (
                        <Image
                          src={item.bottomEdge.image}
                          alt={item?.name}
                          fill
                          className=" z-40 object-cover"
                        />
                      )}
                      {item.surface?.image && (
                        <Image
                          src={item.surface.image}
                          alt={item?.name}
                          fill
                          className=" z-50 object-cover"
                        />
                      )}
                    </div>
                    <div className="text-xs md:text-lg">เค้กออกแบบเอง</div>
                  </div>
                ) : (
                  <User
                    avatarProps={{
                      radius: "md",
                      className:
                        " bg-transparent border-1 w-10 h-10 md:w-20 md:h-20",
                      src:
                        item.type === "SNACK_BOX"
                          ? item.packageType === "PAPER_BAG"
                            ? "/paper-bag.jpeg"
                            : "/snack-box.png"
                          : item.image,
                    }}
                    classNames={{
                      name: "text-xs md:text-lg",
                      description: "text-xs md:text-base font-normal",
                    }}
                    description={item?.description || ""}
                    name={item.name}
                    className=" md:gap-6 md:pl-3"
                  >
                    {item.name}
                  </User>
                )}
              </TableCell>
              <TableCell>
                <div className="justify-center text-center text-xs md:text-lg">{`฿${item.pricePer}`}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center justify-center gap-2 text-xs md:text-lg">
                  <MinusIcon
                    onClick={() => handleDecrease(item.itemId, item.quantity)}
                    className="h-full w-3 cursor-pointer rounded-sm hover:bg-gray-100 md:invisible md:w-7"
                  />

                  <input
                    type="text"
                    value={item.quantity.toString()}
                    aria-label="quantity"
                    maxLength={3}
                    onKeyDown={(e) => e.stopPropagation()}
                    onBlur={(e) =>
                      handleQualityChange(item.itemId, Number(e.target.value))
                    }
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;

                      if (e.target.value === "" || re.test(e.target.value)) {
                        handleTempQuantityChange(
                          item.itemId,
                          Number(e.target.value),
                        );
                      }
                    }}
                    className="relative w-6 items-center rounded-sm border-1 bg-opacity-0 text-center text-xs md:w-12 md:text-lg"
                  />

                  <AddIcon
                    onClick={() => handleIncrease(item.itemId, item.quantity)}
                    className="h-full w-3 cursor-pointer rounded-sm hover:bg-gray-100 md:invisible md:w-7"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center justify-end gap-0 text-xs md:gap-1 md:pr-3 md:text-lg">
                  {`฿${item.price}`}
                  <Button
                    isIconOnly
                    size="sm"
                    radius="md"
                    className="bg-transparent pb-1.5"
                    aria-label="remove button"
                    onPress={() => handleRemove(item.itemId, item.quantity)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
