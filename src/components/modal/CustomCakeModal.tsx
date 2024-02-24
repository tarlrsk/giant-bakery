import React from "react";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import {
  Modal,
  Select,
  Divider,
  ModalBody,
  SelectItem,
  ModalContent,
} from "@nextui-org/react";

import { ICustomCake } from "./types";

// ----------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  data: ICustomCake;
};

// Set font style here because the modal somehow doesn't receive the global font style
const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

// ----------------------------------------------------------------------

export default function CustomCakeModal({ isOpen, onOpenChange, data }: Props) {
  const { name, price, sizes } = data;
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
