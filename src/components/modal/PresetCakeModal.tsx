import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import React, { useMemo, useState, useEffect } from "react";
import { addPresetCakeToCartAction } from "@/actions/cartActions";
import { PersistenceCakeType } from "@/persistence/persistenceType";

import {
  Modal,
  Button,
  Select,
  ModalBody,
  SelectItem,
  ModalContent,
} from "@nextui-org/react";

import { IVariant } from "./types";
import { CloseIcon } from "../icons/CloseIcon";

// ----------------------------------------------------------------------

type Props = {
  slug: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

type IAddCakeToCart = {
  cakeId: string;
  cakeType: "PRESET" | "CUSTOM";
  sizeId: string;
  baseId: string;
  fillingId: string;
  quantity: number;
};

// Set font style here because the modal somehow doesn't receive the global font style
const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

// ----------------------------------------------------------------------

export default function PresetCakeModal({ slug, isOpen, onOpenChange }: Props) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { getCakeBySlug, getVariants, addPresetCakeToCart } = apiPaths();

  const { data } = useSWR(getCakeBySlug(slug, id), fetcher, {
    revalidateOnFocus: false,
  });

  const { data: variantsData } = useSWR(getVariants(), fetcher, {
    revalidateOnFocus: false,
  });

  const item: PersistenceCakeType = data?.response.data || {};

  const variants = variantsData?.response?.data || {};

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedFilling, setSelectedFilling] = useState<string>("");

  async function handleAddToCart(itemId: string) {
    setIsLoading(true);
    const body: IAddCakeToCart = {
      cakeId: itemId,
      cakeType: "PRESET",
      sizeId: selectedSize,
      baseId: selectedBase,
      fillingId: selectedFilling,
      quantity: 1,
    };

    try {
      await addPresetCakeToCartAction(addPresetCakeToCart(), body);
      if (isOpen === true) {
        onOpenChange();
      }
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  const cakePrice = useMemo(() => {
    const selectedPound =
      variants?.sizes?.find((size: IVariant) => size.id === selectedSize)
        ?.name || "1";

    const itemPrice = item?.price || 0;
    return Number(itemPrice) * Number(selectedPound);
  }, [item?.price, selectedSize, variants?.sizes]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedBase("");
      setSelectedSize("");
      setSelectedFilling("");
    } else {
      const onePound =
        variants?.sizes?.find((el: IVariant) => el?.name === "1")?.id || "";

      setSelectedSize(onePound);
    }
  }, [isOpen, variants?.sizes]);
  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-screen-[860px] max-h-75 bg-background-lightGrey"
      classNames={{ body: `${ibm.className}` }}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className=" overflow-auto">
            <div className="flex flex-col gap-5 p-4 md:flex-row md:gap-20">
              <div className=" flex flex-col gap-4">
                <div className=" flex flex-row items-center justify-between">
                  <h1 className=" text-2xl font-medium md:text-3xl">
                    {item?.name}
                  </h1>
                  <Button
                    isIconOnly
                    radius="full"
                    className=" bg-gray-100  md:hidden"
                    onClick={() => onClose()}
                  >
                    <CloseIcon width={20} height={20} color="gray" />
                  </Button>
                </div>
                <Image
                  src={item?.image ?? "/placeholder.svg"}
                  alt={item?.name}
                  width={320}
                  height={64}
                />
              </div>
              <div className=" w-full md:w-6/12">
                <div className=" mb-3 flex flex-row items-center justify-between">
                  <h2 className=" text-2xl font-medium md:text-3xl">
                    ฿
                    {cakePrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </h2>
                  <Button
                    isIconOnly
                    radius="full"
                    className=" hidden bg-gray-100 md:inline-flex"
                    onClick={() => onClose()}
                  >
                    <CloseIcon width={20} height={20} color="gray" />
                  </Button>
                </div>
                <form
                  onSubmit={(e) => {
                    handleAddToCart(item?.id);
                    e.preventDefault();
                  }}
                >
                  <div className="flex flex-col gap-6">
                    <Select
                      size="md"
                      label="ขนาด (ปอนด์)"
                      variant="bordered"
                      selectedKeys={[selectedSize]}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      isRequired
                      required
                    >
                      {variants?.sizes?.map((size: IVariant) => (
                        <SelectItem
                          key={size?.id}
                          value={size?.id}
                          className={`${ibm.className}`}
                        >{`${size?.name} ปอนด์`}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      size="md"
                      label="เนื้อเค้ก"
                      variant="bordered"
                      value={selectedBase}
                      onChange={(e) => setSelectedBase(e.target.value)}
                      isRequired
                      required
                    >
                      {variants?.bases?.map((base: IVariant) => (
                        <SelectItem
                          key={base?.id}
                          className={`${ibm.className}`}
                        >
                          {base?.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      size="md"
                      label="ไส้เค้ก"
                      variant="bordered"
                      value={selectedFilling}
                      onChange={(e) => setSelectedFilling(e.target.value)}
                      isRequired
                      required
                    >
                      {variants?.fillings?.map((filling: IVariant) => (
                        <SelectItem
                          key={filling?.id}
                          className={`${ibm.className}`}
                        >
                          {filling?.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      size="lg"
                      className="h-auto items-center rounded-sm bg-secondaryT-main px-8 py-3  text-white"
                      isLoading={isLoading}
                      type="submit"
                    >
                      ใส่ตะกร้า
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
