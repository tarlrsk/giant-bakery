import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { IBM_Plex_Sans_Thai } from "next/font/google";
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
  const { getCakeBySlug, addCakeToCart, getVariants } = apiPaths();

  const fetchPath = getCakeBySlug(slug, id);

  const { data } = useSWR(fetchPath, fetcher, {
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
      const res = await addPresetCakeToCartAction(addCakeToCart(), body);
      if (isOpen == true) {
        onOpenChange();
      }
      // console.log(res);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="bg-background-lightGrey"
      classNames={{ body: `${ibm.className}` }}
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
              <form
                onSubmit={(e) => {
                  handleAddToCart(item?.id);
                  e.preventDefault();
                }}
              >
                <div className="flex flex-col gap-[30px]">
                  <Select
                    size="md"
                    label="ขนาด (ปอนด์)"
                    variant="bordered"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    isRequired
                    required
                  >
                    {variants?.sizes?.map((size: IVariant) => (
                      <SelectItem
                        key={size?.id}
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
                      <SelectItem key={base?.id} className={`${ibm.className}`}>
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
                    className="h-auto bg-secondaryT-main items-center text-white text-2xl font-medium rounded-[8px] px-8 py-3"
                    isLoading={isLoading}
                    type="submit"
                  >
                    ใส่ตะกร้า
                  </Button>
                </div>
              </form>
              {/* <div className="flex flex-col gap-8 justify-center items-center">
              </div> */}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
