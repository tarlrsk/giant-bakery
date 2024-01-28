"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { QRCodeIcon } from "@/components/icons/QRCodeIcon";
import { CreditCardIcon } from "@/components/icons/CreditCardIcon";
import CheckoutSummaryTable from "@/components/cart-table/CheckoutSummaryTable";

import {
  cn,
  Input,
  Radio,
  Button,
  Select,
  Divider,
  Textarea,
  Accordion,
  RadioGroup,
  SelectItem,
  Autocomplete,
  AccordionItem,
  AutocompleteItem,
} from "@nextui-org/react";

// ----------------------------------------------------------------------

const ACCORDION_ITEM_CLASS_NAMES = {
  base: "py-2",
  title: "text-xl text-primaryT-darker",
  trigger: "data-[open=true]:cursor-auto",
};

const ACCORDION_KEYS = ["1", "2", "3", "4"];

const DISTRICT_DATA = [{ label: "เมืองระยอง", value: "01" }];

const SUB_DISTRICT_DATA = [
  { label: "เนินพระ", value: "01" },
  { label: "ท่าประดู่", value: "02" },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: "full", label: "เต็มจำนวน" },
  { value: "deposit", label: "มัดจำ (ชำระส่วนที่เหลือเมื่อออเดอร์เสร็จ)" },
];

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  // Email state
  const [email, setEmail] = useState("");
  // Delivery state
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState("delivery");
  const [zipCode, setZipCode] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  // Comment
  const [comment, setComment] = useState("");
  // Payment
  const [selectedPaymentType, setSelectedPaymentType] = useState(["full"]);

  function handleGoNextSection(key: string) {
    const nextKey: string = (Number(key) + 1).toString();
    const newSelectedKeys = [nextKey];
    setSelectedKeys(newSelectedKeys);
  }

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const isInvalidPhoneNumber = useMemo(() => {
    if (phone === "") return false;
    return validatePhoneNumber(phone) ? false : true;
  }, [phone]);

  const isInvalidZipCode = useMemo(() => {
    if (zipCode === "") return false;
    return validateZipCode(zipCode) ? false : true;
  }, [zipCode]);

  const renderEmailItem = (
    <AccordionItem
      key="1"
      aria-label="Accordion 1"
      title="1. อีเมลของคุณ"
      subtitle={email && !selectedKeys.includes("1") ? email : ""}
      classNames={ACCORDION_ITEM_CLASS_NAMES}
      hideIndicator={selectedKeys.includes("1")}
    >
      <CustomForm>
        <Input
          value={email}
          onValueChange={setEmail}
          type="email"
          label="อีเมล"
          variant="bordered"
          className="mb-4"
          isInvalid={isInvalidEmail}
          errorMessage={isInvalidEmail && "โปรดใส่อีเมลที่ถูกต้อง"}
          isRequired
        />
        <ConfirmButton
          onClickButton={() =>
            !isInvalidEmail && email && handleGoNextSection("1")
          }
        />
      </CustomForm>
    </AccordionItem>
  );

  const renderDeliveryOptionItem = (
    <AccordionItem
      key="2"
      aria-label="Accordion 2"
      title="2. การจัดส่ง"
      classNames={ACCORDION_ITEM_CLASS_NAMES}
      hideIndicator={selectedKeys.includes("2")}
      className="text-primaryT-darker"
    >
      <CustomForm>
        <div className=" border p-4 mb-5">
          <RadioGroup
            value={selectedDeliveryOption}
            onValueChange={setSelectedDeliveryOption}
            label="ตัวเลือกการจัดส่ง"
            color="primary"
            isRequired
          >
            <CustomDeliveryRadio value="delivery" className="mt-1 max-w-none">
              <span>จัดส่งถึงบ้าน</span>
              <span>คิดตามระยะทาง</span>
            </CustomDeliveryRadio>
            <Divider className="my-2" />
            <CustomDeliveryRadio
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
            </CustomDeliveryRadio>
          </RadioGroup>
        </div>

        {selectedDeliveryOption === "delivery" && (
          <div className="flex flex-col gap-4 mb-4">
            <div className=" flex gap-4">
              <Input
                value={firstName}
                onValueChange={setFirstName}
                label="ชื่อ"
                variant="bordered"
                isRequired
              />
              <Input
                value={lastName}
                onValueChange={setLastName}
                label="นามสกุล"
                variant="bordered"
                isRequired
              />
            </div>
            <Input
              value={phone}
              onValueChange={(e: string) => {
                e.length <= 10 && setPhone(e);
              }}
              label="หมายเลขโทรศัพท์"
              variant="bordered"
              isInvalid={isInvalidPhoneNumber}
              errorMessage={
                isInvalidPhoneNumber && "โปรดใส่หมายเลขโทรศัพท์ที่ถูกต้อง"
              }
              isRequired
            />
            <h3>รายการที่อยู่จัดส่ง</h3>

            <Textarea
              value={address}
              onValueChange={setAddress}
              label="ที่อยู่"
              variant="bordered"
              isRequired
            />

            <div className=" flex gap-4">
              <Input
                value={zipCode}
                onValueChange={(e: string) => {
                  e.length <= 5 && setZipCode(e);
                }}
                label="รหัสไปรษณีย์"
                variant="bordered"
                isInvalid={isInvalidZipCode}
                errorMessage={
                  isInvalidZipCode && "โปรดใส่รหัสไปรษณีย์ที่ถูกต้อง"
                }
                isRequired
              />
              <Autocomplete
                defaultItems={SUB_DISTRICT_DATA}
                label="แขวง/ตำบล"
                variant="bordered"
                selectedKey={subDistrict}
                onSelectionChange={(selected) =>
                  setSubDistrict(selected as string)
                }
                isRequired
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
            </div>

            <div className=" flex gap-4">
              <Autocomplete
                defaultItems={DISTRICT_DATA}
                label="เขต/อำเภอ"
                variant="bordered"
                selectedKey={district}
                onSelectionChange={(selected) =>
                  setDistrict(selected as string)
                }
                isRequired
              >
                {(district) => (
                  <AutocompleteItem
                    key={district.value}
                    className=" rounded-sm"
                  >
                    {district.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Input label="จังหวัด" value={province} isDisabled isRequired />
            </div>
          </div>
        )}

        <ConfirmButton
          onClickButton={() => {
            if (selectedDeliveryOption === "delivery") {
              if (
                firstName &&
                lastName &&
                phone &&
                address &&
                subDistrict &&
                district
              ) {
                handleGoNextSection("2");
              }
            } else {
              handleGoNextSection("2");
            }
          }}
        />
      </CustomForm>
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
      <CustomForm>
        <Input
          value={comment}
          onValueChange={setComment}
          label="ต้องการห่อของขวัญ? แพ้อาหารบางชนิด? โน้ตไว้เลย"
          variant="bordered"
          className="mb-4"
        />
        <ConfirmButton onClickButton={() => handleGoNextSection("3")} />
      </CustomForm>
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
      <h3>วิธีการชำระเงิน</h3>
      <RadioGroup
        defaultValue="qr"
        className="mt-1 mb-4"
        classNames={{ wrapper: "md:flex-row" }}
      >
        <CustomPaymentRadio value="qr">
          <div className="flex flex-row items-center gap-4">
            <QRCodeIcon
              width={40}
              height={40}
              className=" text-disabled group-data-[selected=true]:text-primaryT-main pb-0.5"
            />
            ชำระผ่าน QR Code
          </div>
        </CustomPaymentRadio>
        <CustomPaymentRadio value="card">
          <div className="flex flex-row items-center gap-4">
            <CreditCardIcon
              width={40}
              height={40}
              className=" text-disabled group-data-[selected=true]:text-primaryT-main  pb-0.5"
            />
            ชำระผ่านบัตร
          </div>
        </CustomPaymentRadio>
      </RadioGroup>
      <h3>ประเภทการชำระเงิน</h3>
      <Select
        value={selectedPaymentType}
        onSelectionChange={(selected) => {
          setSelectedPaymentType(Array.from(selected) as string[]);
        }}
        defaultSelectedKeys={["full"]}
        size="sm"
        variant="bordered"
        radius="md"
        className="mb-4 mt-1"
        description="สามารถจ่ายเป็นมัดจำได้เมื่อซื้อสินค้าครบตามจำนวนที่กำหนด"
      >
        {PAYMENT_TYPE_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className=" rounded-sm"
          >
            {option.label}
          </SelectItem>
        ))}
      </Select>
      <ConfirmButton onClickButton={() => console.log("submit")} />
    </AccordionItem>
  );

  return (
    <div className="container px-6 py-20">
      <div className="flex flex-col  h-full w-full justify-start items-center gap-6">
        <div className="w-full md:container md:mx-auto md:px-36 ">
          <h1 className="text-2xl md:text-3xl font-medium text-left mb-4">
            ดำเนินการชำระเงิน
          </h1>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Accordion
                variant="splitted"
                className="!px-0 max-w-xl"
                selectedKeys={selectedKeys}
                disabledKeys={ACCORDION_KEYS.filter(
                  (key) => key > selectedKeys[0],
                )}
                onSelectionChange={(event) => {
                  Array.from(event).length > 0 &&
                    setSelectedKeys(Array.from(event) as string[]);
                }}
              >
                {renderEmailItem}

                {renderDeliveryOptionItem}

                {renderCommentItem}

                {renderPaymentItem}
              </Accordion>
            </div>

            <CheckoutSummaryTable />
          </div>
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
      type="submit"
    >
      ยืนยัน
    </Button>
  );
};

const CustomDeliveryRadio = (props: any) => {
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

const CustomPaymentRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse flex-1 max-w-none cursor-pointer rounded-lg gap-2 p-3 pl-3 pr-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

const CustomForm = (props: any) => {
  const { children } = props;

  return <form onSubmit={(e) => e.preventDefault()}>{children}</form>;
};

function validateEmail(value: string) {
  return value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
}

function validateZipCode(value: string) {
  return value.match(/^[0-9]{5}$/);
}

function validatePhoneNumber(value: string) {
  return value.match(/^[0-9]{10}$/);
}
