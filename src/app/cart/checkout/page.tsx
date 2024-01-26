"use client";
import Link from "next/link";
import React, { useState } from "react";

import {
  Input,
  Radio,
  Button,
  Divider,
  Textarea,
  Accordion,
  RadioGroup,
  Autocomplete,
  AccordionItem,
  AutocompleteItem,
} from "@nextui-org/react";

// ----------------------------------------------------------------------

const ACCORDION_ITEM_CLASS_NAMES = {
  base: "py-2",
  title: "text-xl",
};

const ACCORDION_KEYS = ["1", "2", "3", "4"];

const PROVINCE_DATA = [
  { label: "กรุงเทพ", value: "01" },
  { label: "ระยอง", value: "02" },
];

const DISTRICT_DATA = [{ label: "เมืองระยอง", value: "01" }];

const SUB_DISTRICT_DATA = [
  { label: "เนินพระ", value: "01" },
  { label: "ท่าประดู่", value: "02" },
];

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  // Email state
  const [email, setEmail] = useState("");
  // Delivery state
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState("delivery");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
      subtitle={email && !selectedKeys.includes("1") ? email : ""}
      classNames={ACCORDION_ITEM_CLASS_NAMES}
      hideIndicator={selectedKeys.includes("1")}
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

  const renderDeliveryOptionItem = (
    <AccordionItem
      key="2"
      aria-label="Accordion 2"
      title="2. การจัดส่ง"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
      hideIndicator={selectedKeys.includes("2")}
    >
      <div className=" border p-4 mb-5">
        <RadioGroup
          value={selectedDeliveryOption}
          onValueChange={setSelectedDeliveryOption}
          label="ตัวเลือกการจัดส่ง"
          color="secondary"
        >
          <CustomRadio value="delivery" className="mt-1 max-w-none">
            <span>จัดส่งถึงบ้าน</span>
            <span>คิดตามระยะทาง</span>
          </CustomRadio>
          <Divider className="my-2" />
          <CustomRadio
            value="pickup"
            description="อำเภอเมือง จังหวัดระยอง"
            className="max-w-none"
          >
            <span>สั่งและรับที่ร้าน</span>
            <span className=" absolute right-0">ฟรี</span>
            <Link
              //TODO: replace this url with the map
              href="https://www.google.com"
              target="_blank"
              className=" absolute right-0 top-6 text-sm text-disabled underline z-10"
            >
              Google Maps
            </Link>
          </CustomRadio>
        </RadioGroup>
      </div>

      {selectedDeliveryOption === "delivery" && (
        <form className="flex flex-col gap-5 mb-4">
          <div className=" flex gap-4">
            <Input
              value={firstName}
              onValueChange={setFirstName}
              label="ชื่อ"
              variant="bordered"
            />
            <Input
              value={lastName}
              onValueChange={setLastName}
              label="นามสกุล"
              variant="bordered"
            />
          </div>
          <Input
            value={phone}
            onValueChange={setPhone}
            label="หมายเลขโทรศัพท์"
            variant="bordered"
          />
          <h3>รายการที่อยู่จัดส่ง</h3>

          <Textarea
            value={address}
            onValueChange={setAddress}
            label="ที่อยู่"
            variant="bordered"
          />

          <Autocomplete
            defaultItems={PROVINCE_DATA}
            label="จังหวัด"
            variant="bordered"
            selectedKey={selectedProvince}
            onSelectionChange={(selected) =>
              setSelectedProvince(selected as string)
            }
          >
            {(province) => (
              <AutocompleteItem key={province.value} className=" rounded-sm">
                {province.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          <div className=" flex gap-4">
            <Autocomplete
              defaultItems={DISTRICT_DATA}
              label="เขต/อำเภอ"
              variant="bordered"
              selectedKey={selectedDistrict}
              onSelectionChange={(selected) =>
                setSelectedDistrict(selected as string)
              }
            >
              {(district) => (
                <AutocompleteItem key={district.value} className=" rounded-sm">
                  {district.label}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              defaultItems={SUB_DISTRICT_DATA}
              label="แขวง/ตำบล"
              variant="bordered"
              selectedKey={selectedSubDistrict}
              onSelectionChange={(selected) =>
                setSelectedSubDistrict(selected as string)
              }
            >
              {(subDistrict) => (
                <AutocompleteItem
                  key={subDistrict.value}
                  className=" rounded-sm"
                >
                  {subDistrict.label}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Input label="รหัสไปรษณีย์" variant="bordered" isDisabled />
          </div>
        </form>
      )}

      <ConfirmButton
        onClickButton={() => {
          handleClickButton("2");
        }}
      />
    </AccordionItem>
  );

  const renderCommentItem = (
    <AccordionItem
      key="3"
      aria-label="Accordion 3"
      title="3. ข้อความถึงร้านค้า"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
      hideIndicator={selectedKeys.includes("3")}
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
      hideIndicator={selectedKeys.includes("4")}
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

            {renderDeliveryOptionItem}

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

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        labelWrapper: " w-full",
        label: "flex justify-between",
      }}
    >
      {children}
    </Radio>
  );
};
