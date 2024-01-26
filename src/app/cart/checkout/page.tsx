"use client";
import React, { useState } from "react";

import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";

// ----------------------------------------------------------------------

const ACCORDION_ITEM_CLASS_NAMES = {
  base: "py-2",
  title: "text-xl",
};

const ACCORDION_KEYS = ["1", "2", "3", "4"];

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const disabledKeysRef = ["1", "2", "3", "4"];

  const [email, setEmail] = useState("");

  const [selectedKeys, setSelectedKeys] = useState(["1"]);

  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  function handleClickButton(key: string) {
    const nextKey: string = (Number(key) + 1).toString();
    const newSelectedKeys = [nextKey];
    setSelectedKeys(newSelectedKeys);
  }

  const renderEmailItem = (
    <AccordionItem
      key="1"
      aria-label="Accordion 1"
      title="1. อีเมลของคุณ"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
    >
      <Input
        value={email}
        onValueChange={setEmail}
        autoFocus
        label="อีเมล"
        variant="bordered"
        className="mb-4"
      />
      <ConfirmButton onClickButton={() => handleClickButton("1")} />
    </AccordionItem>
  );

  const renderAddressItem = (
    <AccordionItem
      key="2"
      aria-label="Accordion 2"
      title="2. การจัดส่ง"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
    >
      <Input
        value={email}
        onValueChange={setEmail}
        autoFocus
        label="อีเมล"
        variant="bordered"
        className="mb-4"
      />
      <ConfirmButton onClickButton={() => handleClickButton("2")} />
    </AccordionItem>
  );

  const renderCommentItem = (
    <AccordionItem
      key="3"
      aria-label="Accordion 3"
      title="3. ข้อความถึงร้านค้า"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
    >
      {defaultContent}
      <ConfirmButton onClickButton={() => handleClickButton("3")} />
    </AccordionItem>
  );

  const renderPaymentItem = (
    <AccordionItem
      key="4"
      aria-label="Accordion 3"
      title="4. วิธีการชำระเงิน"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
    >
      {defaultContent}
    </AccordionItem>
  );

  return (
    <div className="container px-6 py-20">
      <div className={`flex flex-col  h-full justify-start items-center gap-6`}>
        <div className="container px-6">
          <h1 className="text-2xl md:text-3xl font-medium text-left mb-4">
            ดำเนินการชำระเงิน
          </h1>
          <Accordion
            variant="splitted"
            className="!px-0 max-w-xl"
            selectedKeys={selectedKeys}
            disabledKeys={ACCORDION_KEYS.filter((key) => key > selectedKeys[0])}
            onSelectionChange={(event) =>
              setSelectedKeys(Array.from(event) as string[])
            }
          >
            {renderEmailItem}

            {renderAddressItem}

            {renderCommentItem}

            {renderPaymentItem}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

const ConfirmButton = ({ onClickButton }: { onClickButton: () => void }) => {
  return (
    <Button
      color="secondary"
      onClick={onClickButton}
      size="lg"
      className=" text-lg rounded-xs"
      fullWidth
    >
      ยืนยัน
    </Button>
  );
};
