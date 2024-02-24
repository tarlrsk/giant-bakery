import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import useSWRMutation from "swr/mutation";
import { useSearchParams } from "next/navigation";
import getCurrentUser from "@/actions/userActions";
import { PersistenceCakeType } from "@/persistence/persistenceType";

import {
  Modal,
  Button,
  Select,
  ModalBody,
  SelectItem,
  ModalContent,
} from "@nextui-org/react";

type Props = {
  slug: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

type IAddCakeToCart = {
  userId: string;
  type: "MEMBER" | "GUEST";
  cakeId: string;
  cakeType: "PRESET" | "CUSTOM";
  sizeId: string;
  baseId: string;
  fillingId: string;
  quantity: 1;
};

async function sendAddCakeRequesst(
  url: string,
  { arg }: { arg: IAddCakeToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function PresetCakeModal({ slug, isOpen, onOpenChange }: Props) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { getCakeBySlug, addCakeToCart } = apiPaths();

  const fetchPath = getCakeBySlug(slug, id);

  const { data } = useSWR(fetchPath, fetcher);

  const item: PersistenceCakeType = data?.response.data || {};

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedFilling, setSelectedFilling] = useState<string>("");

  const { trigger: triggerAddToCart, isMutating: isMutatingAddToCart } =
    useSWRMutation(addCakeToCart(), sendAddCakeRequesst);

  async function handleAddToCart(itemId: string) {
    const currentUser = await getCurrentUser();

    const body: IAddCakeToCart = {
      userId: currentUser?.id || "",
      type: currentUser?.role === "CUSTOMER" ? "MEMBER" : "GUEST",
      cakeId: itemId,
      cakeType: "PRESET",
      sizeId: selectedSize,
      baseId: selectedBase,
      fillingId: selectedFilling,
      quantity: 1,
    };

    try {
      await triggerAddToCart(body);
      if (isOpen == true) {
        onOpenChange();
      }
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="bg-background-lightGrey"
    >
      <ModalContent>
        <ModalBody>
          <div className="flex m-4 gap-20">
            <div>
              <h1
                className={`text-3xl font-medium ${
                  item?.remark ? "pb-6" : "pb-0"
                }`}
              >
                {item?.name}
              </h1>
              <p className="font-light">{item?.remark}</p>
              <hr className="h-px my-6 bg-black border-1" />
              <Image
                src={item?.image ?? "/placeholder-image.jpeg"}
                alt={item?.name}
                width={320}
                height={64}
              />
            </div>
            <div className="w-6/12">
              <h2 className="text-3xl font-medium">
                ฿{item?.price?.toFixed(2)}
              </h2>
              <hr className="h-px my-6 bg-black border-1" />
              <div className="flex flex-col gap-[30px]">
                <Select
                  size="md"
                  label="ขนาด (ปอนด์)"
                  variant="bordered"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  isRequired
                >
                  {item?.sizes?.map((size) => (
                    <SelectItem key={size?.id}>{size?.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  size="md"
                  label="เนื้อเค้ก"
                  variant="bordered"
                  value={selectedBase}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  isRequired
                >
                  {item?.bases?.map((base) => (
                    <SelectItem key={base?.id}>{base?.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  size="md"
                  label="ไส้เค้ก"
                  variant="bordered"
                  value={selectedFilling}
                  onChange={(e) => setSelectedFilling(e.target.value)}
                  isRequired
                >
                  {item?.fillings?.map((filling) => (
                    <SelectItem key={filling?.id}>{filling?.name}</SelectItem>
                  ))}
                </Select>
                <Button
                  className="h-auto bg-secondaryT-main items-center text-white text-2xl font-medium rounded-[8px] px-8 py-3"
                  isLoading={isMutatingAddToCart}
                  onClick={() => {
                    handleAddToCart(item?.id);
                  }}
                >
                  ใส่ตะกร้า
                </Button>
              </div>
              {/* <div className="flex flex-col gap-8 justify-center items-center">
              </div> */}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
