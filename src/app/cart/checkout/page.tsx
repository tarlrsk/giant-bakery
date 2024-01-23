"use client";
import React, { useState } from "react";

import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const AccordionItemClassNames = {
    base: "py-2",
    title: "text-xl",
  };

  const [email, setEmail] = useState("");

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
            onSelectionChange={(key) =>
              setSelectedKeys(new Set((key as any)?.currentKey || "1"))
            }
          >
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title="1. อีเมลของคุณ"
              classNames={AccordionItemClassNames}
            >
              <Input
                value={email}
                onValueChange={setEmail}
                autoFocus
                label="อีเมล"
                variant="bordered"
                className="mb-4"
              />
              <Button
                color="secondary"
                onClick={() => setSelectedKeys(new Set("2"))}
                fullWidth
              >
                ยืนยัน
              </Button>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Accordion 2"
              title="2. การจัดส่ง"
              classNames={AccordionItemClassNames}
            >
              {defaultContent}
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Accordion 3"
              title="3. ข้อความถึงร้านค้า"
              classNames={AccordionItemClassNames}
            >
              {defaultContent}
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="Accordion 3"
              title="4. วิธีการชำระเงิน"
              classNames={AccordionItemClassNames}
            >
              {defaultContent}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
