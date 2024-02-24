import useSWR from "swr";
// import Image from "next/image";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { PersistenceCakeType } from "@/persistence/persistenceType";

import {
  Modal,
  Select,
  //   Button,
  Divider,
  //   Select,
  ModalBody,
  SelectItem,
  //   SelectItem,
  ModalContent,
} from "@nextui-org/react";

type Props = {
  slug: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

// Set font style here because the modal somehow doesn't receive the global font style
const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

const MOCKUP_ITEM = {
  id: "faabcd72-cff4-4310-aef5-0fb9a656ed83",
  name: "เค้กวันแม่",
  remark: null,
  quantity: 0,
  imageFileName: "2024_02_23_เค้กวันแม่.png",
  imagePath:
    "cakes/PRESET/faabcd72-cff4-4310-aef5-0fb9a656ed83/2024_02_23_เค้กวันแม่.png",
  image:
    "https://storage.googleapis.com/cukedoh-bucket-dev/cakes/PRESET/faabcd72-cff4-4310-aef5-0fb9a656ed83/2024_02_23_%E0%B9%80%E0%B8%84%E0%B9%89%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%81%E0%B8%A1%E0%B9%88.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709278905&Signature=fOEOC94mdzg2q%2FD0E1dAWbQ8sfiWA0GmdJvot7olj1Rf5dLhn%2BjTSwmUG94viGeKcuAZBdPQja8uuT1U5eZq4F5AeXUiTH38j6I3QcKIM%2FarguE10YEULpWl4wPrj4cZY9PZUPji6X2LdtyanICaiCPdyi41DLL2ZUN9mMVP3LyzdAP26JOfmtWXl%2BICzJ%2BWavOkXG9eI2lQwO72UfQz82WlCq7fV5YTK%2BV8bFepRTOmqXrvBOG2v%2FlMPJ6NbNEPEZSPxUGyl7s3tzpgxG8V%2FQuzC%2FTghnIfG9KJ60Ry9d3pMxoa5S1DqRrKue5cHSe4WIh5evJq2AwHLDZsOl6p0w%3D%3D",
  type: "PRESET",
  price: 420,
  weight: 600,
  height: 6,
  length: 15,
  width: 15,
  isActive: true,
  isDeleted: false,
  createdAt: "2024-02-22T17:12:33.902Z",
  updatedAt: "2024-02-22T17:12:33.902Z",
  deletedAt: null,
  sizes: [
    {
      id: "96c87bc8-4175-453e-bf6b-3566c097bb4f",
      name: "1",
      isActive: true,
      createdAt: "2024-02-22T23:49:31.972Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "a4cf26f2-9020-4fda-936f-4d532cca949b",
      name: "2",
      isActive: true,
      createdAt: "2024-02-22T23:49:32.005Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "39567e02-4b30-458f-b2fb-667c4c2dbcad",
      name: "3",
      isActive: true,
      createdAt: "2024-02-22T23:49:32.038Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
  ],
  bases: [
    {
      id: "ed032727-eca8-4896-bcb7-41c715929ea9",
      name: "วานิลลา",
      isActive: true,
      createdAt: "2024-02-22T22:47:54.850Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "112482bb-72e5-4012-a93a-9325b9868099",
      name: "ช็อกโกแลต",
      isActive: true,
      createdAt: "2024-02-22T22:47:54.884Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "706f8a83-d6ce-4538-bbb6-ba9260ff863f",
      name: "ใบเตย",
      isActive: true,
      createdAt: "2024-02-22T22:47:54.918Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "6ce1440b-c0f1-4524-ad57-7f8eccd7d334",
      name: "กาแฟ",
      isActive: true,
      createdAt: "2024-02-22T22:47:55.018Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "7a0b5d8a-4464-4728-9d21-e3ffbc4be371",
      name: "เค้กนมสด",
      isActive: true,
      createdAt: "2024-02-22T22:47:55.065Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "e2dfdccf-de11-4a1b-8a2c-fd7c55706564",
      name: "นมสดใบเตยมะพร้าวอ่อน",
      isActive: true,
      createdAt: "2024-02-22T22:47:55.100Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
  ],
  fillings: [
    {
      id: "25fb904e-d350-4b38-a748-fb4634c05cbc",
      name: "ส้ม",
      isActive: true,
      createdAt: "2024-02-22T22:50:42.836Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "d4831df5-1214-4a28-b6e0-868a6c5ceb90",
      name: "สตอเบอรี่",
      isActive: true,
      createdAt: "2024-02-22T22:50:42.871Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "df1e1402-025f-403f-ae9e-33ac74fcf388",
      name: "บลูเบอรี่",
      isActive: true,
      createdAt: "2024-02-22T22:50:42.904Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "64bc3204-aafb-4bf9-88e0-54dead557023",
      name: "ครีมช็อกโกแลต",
      isActive: true,
      createdAt: "2024-02-22T22:50:42.989Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "52696f8a-34bf-4a62-8ada-633543422748",
      name: "ครีมนมสด",
      isActive: true,
      createdAt: "2024-02-22T22:50:43.030Z",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
  ],
  creams: [],
  topEdges: [],
  bottomEdges: [],
  decorations: [],
  surfaces: [],
};

// ----------------------------------------------------------------------

export default function CustomCakeModal({ slug, isOpen, onOpenChange }: Props) {
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

  const { name, price, sizes } = MOCKUP_ITEM;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      classNames={{ body: `px-0 py-0 ${ibm.className}` }}
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className=" grid grid-cols-5 ">
                <div className="bg-white  col-span-2 p-4">
                  <p className="font-medium text-xl">{name}</p>
                  <div className=" mt-4">
                    <p>General</p>
                    <Divider />
                    <Select size="sm" items={sizes}>
                      {(size) => (
                        <SelectItem
                          key={size.id}
                        >{`${size.name} ปอนด์`}</SelectItem>
                      )}
                    </Select>
                  </div>
                </div>
                <div className="bg-primaryT-lighter  col-span-3 p-4">
                  <p className=" font-medium text-xl">{`${price} บาท`}</p>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
