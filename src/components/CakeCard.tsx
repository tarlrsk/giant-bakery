import React from "react";
import Image from "next/image";
// import toast from "react-hot-toast";
import { Cake } from "@prisma/client";
// import apiPaths from "@/utils/api-path";
// import useSWRMutation from "swr/mutation";
// import getCurrentUser from "@/actions/userActions";

import { Card, Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

type Props = {
  item: Cake;
  size?: "sm" | "md";
  onClick?: () => void;
};

// type IAddSnackBoxToCart = {
//   userId: string;
//   type: "MEMBER" | "GUEST";
//   snackBoxId: string;
//   quantity: number;
// };

// async function sendAddSnackBoxRequest(
//   url: string,
//   { arg }: { arg: IAddSnackBoxToCart },
// ) {
//   await fetch(url, {
//     method: "POST",
//     body: JSON.stringify(arg),
//   }).then((res) => res.json());
// }

// ----------------------------------------------------------------------

export default function CakeCard({ item, onClick, size = "md" }: Props) {
  // TODO : ADD CAKE TO CART
  //   const { addPresetSnackBoxToCart, addCustomSnackBoxToCart } = apiPaths();

  //   const { trigger: triggerAddToCart, isMutating: isMutatingAddToCart } =
  //     useSWRMutation(addPresetSnackBoxToCart(), sendAddSnackBoxRequest);

  //   async function handleAddToCart(itemId: string) {
  //     const currentUser = await getCurrentUser();

  //     const body: IAddSnackBoxToCart = {
  //       userId: currentUser?.id || "",
  //       type: currentUser?.role === "CUSTOMER" ? "MEMBER" : "GUEST",
  //       snackBoxId: itemId,
  //       quantity: 1,
  //     };

  //     try {
  //       await triggerAddToCart(body);
  //       toast.success("ใส่ตะกร้าสำเร็จ");
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
  //     }
  //   }

  return (
    <Card
      className={` bg-white pb-1 md:pb-2 w-44 md:w-unit-80 rounded-md shadow-md hover:cursor-pointer h-full items-center`}
      isPressable
      onPress={onClick}
    >
      <div className=" relative w-full h-36 md:h-64">
        <Image
          src={(item?.image as string) ?? "/placeholder-image.jpeg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>

      <article
        className={`flex flex-col flex-wrap text-pretty p-6 gap-${
          size === "sm" ? "1" : "2 items-center"
        }`}
      >
        <p
          className={`text-primaryT-darker truncate text-lg md:text-xl font-normal max-w-full`}
        >
          {item?.name}
        </p>

        <p className={`text-secondaryT-main text-lg md:text-xl font-semibold`}>
          ฿{item?.price?.toFixed(0) ?? 0}
        </p>
        <Button
          size={size}
          onClick={onClick}
          className={`bg-secondaryT-main items-center text-white text-md rounded-sm px-12`}
        >
          ใส่ตะกร้า
        </Button>
      </article>
    </Card>
  );
}
