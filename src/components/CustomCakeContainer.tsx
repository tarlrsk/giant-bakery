"use client";
import React, { useState } from "react";
import Circle from "@uiw/react-color-circle";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import {
  Modal,
  Button,
  Select,
  Divider,
  ModalBody,
  SelectItem,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

// ----------------------------------------------------------------------

const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

// ----------------------------------------------------------------------

export default function CustomCakeContainer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <Button color="primary" onPress={onOpen}>
          Custom cake
        </Button>
        <CustomCakeModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

const sizes = [
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
];

const bases = [
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
];

const fillings = [
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
];

const availableColors = [
  "#F48c08", // orange
  "#aa2639", // red
  "#e388df", // pink
  "#5997bc", // light blue
  "#3780b3", // blue
  "#80c06d", // green apple
  "#7758a9", // purple
  "#2f5e1e", // dark green
  "#e6e007", // lemon
  "#443300", // brown
];

// ----------------------------------------------------------------------

type CustomCakeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export function CustomCakeModal({
  isOpen,
  onOpenChange,
}: CustomCakeModalProps) {
  const [selectedPounds, setSelectedPound] = useState("1");
  const [creamHex, setCreamHex] = useState("#F44E3B");
  const [topEdgeHex, setTopEdgeHex] = useState("#F44E3B");
  const [bottomEdgeHex, setBottomEdgeHex] = useState("#F44E3B");

  return (
    <Modal
      size="5xl"
      isOpen={true}
      onOpenChange={onOpenChange}
      hideCloseButton
      classNames={{ body: `${ibm.className}` }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className=" px-0 py-0">
              <div className="grid grid-cols-3">
                <div className=" col-span-1 relative p-6">
                  {/* Left-hand side */}
                  <Divider
                    orientation="vertical"
                    className=" absolute top-0 right-0"
                  />
                  <h6 className=" text-3xl">เค้กแต่งเอง</h6>
                  <div className=" flex flex-col my-5 gap-3">
                    <Select fullWidth size="sm" items={sizes} label="ปอนด์">
                      {(size) => (
                        <SelectItem
                          key={size.id}
                        >{`${size.name} ปอนด์`}</SelectItem>
                      )}
                    </Select>
                    <Select fullWidth size="sm" items={bases} label="เนื้อเค้ก">
                      {(base) => (
                        <SelectItem key={base.id}>{`${base.name}`}</SelectItem>
                      )}
                    </Select>
                    <Select
                      fullWidth
                      size="sm"
                      items={fillings}
                      label="ไส้เค้ก"
                    >
                      {(filling) => (
                        <SelectItem
                          key={filling.id}
                        >{`${filling.name}`}</SelectItem>
                      )}
                    </Select>

                    <p>
                      เลือกครีม
                      <Divider />
                    </p>
                    <div className=" rounded-full w-7 h-7 bg-black">
                      <div className="image"></div>​
                    </div>

                    <p>
                      เลือกสีครีม
                      <Divider />
                    </p>
                    <Circle
                      colors={availableColors}
                      color={creamHex}
                      onChange={(color) => {
                        setCreamHex(color.hex);
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 p-6">
                  {/* Right-hand side */}
                  <h6 className=" text-3xl text-primaryT-main">฿300</h6>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
