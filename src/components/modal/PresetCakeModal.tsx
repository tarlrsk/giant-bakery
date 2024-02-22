import useSWR from "swr";
import Image from "next/image";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
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

const mockdata = [
  {
    id: 1,
    name: "pound1",
  },
  {
    id: 2,
    name: "pound1",
  },
  {
    id: 3,
    name: "pound1",
  },
  {
    id: 4,
    name: "pound1",
  },
  {
    id: 5,
    name: "pound1",
  },
  {
    id: 6,
    name: "pound1",
  },
];

export default function PresetCakeModal({ slug, isOpen, onOpenChange }: Props) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { getCakeBySlug } = apiPaths();

  const fetchPath = getCakeBySlug(slug, id);

  const { data } = useSWR(fetchPath, fetcher);

  const item: PersistenceCakeType = data?.response.data || {};

  const [selectedPound, setSelectedPound] = useState<string>("");
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedFilling, setSelectedFilling] = useState<string>("");

  console.log(item);

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
                  label="Cake Size"
                  variant="bordered"
                  value={selectedPound}
                  onChange={(e) => setSelectedPound(e.target.value)}
                  isRequired
                >
                  {mockdata.map((pound) => (
                    <SelectItem key={pound.id}>{pound.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  size="md"
                  label="Cake Base"
                  variant="bordered"
                  value={selectedPound}
                  onChange={(e) => setSelectedPound(e.target.value)}
                  isRequired
                >
                  {mockdata.map((pound) => (
                    <SelectItem key={pound.id}>{pound.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  size="md"
                  label="Cake Fillings"
                  variant="bordered"
                  value={selectedPound}
                  onChange={(e) => setSelectedPound(e.target.value)}
                  isRequired
                >
                  {mockdata.map((pound) => (
                    <SelectItem key={pound.id}>{pound.name}</SelectItem>
                  ))}
                </Select>
                <Button
                  className="h-auto bg-secondaryT-main items-center text-white text-2xl font-medium rounded-[8px] px-8 py-3"
                  isLoading={false}
                  onClick={() => {}}
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
