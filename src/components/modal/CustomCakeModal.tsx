import useSWR from "swr";
// import Image from "next/image";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { PersistenceCakeType } from "@/persistence/persistenceType";

import {
  Modal,
  //   Button,
  //   Select,
  ModalBody,
  //   SelectItem,
  ModalContent,
} from "@nextui-org/react";

type Props = {
  slug: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

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

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="bg-background-lightGrey"
    >
      <ModalContent>
        <ModalBody>
          <div className="flex m-4 gap-20">Custom</div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
