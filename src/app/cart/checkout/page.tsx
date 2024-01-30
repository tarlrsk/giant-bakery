"use client";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/axios";
import AddIcon from "@/components/icons/AddIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { QRCodeIcon } from "@/components/icons/QRCodeIcon";
import React, { useMemo, useState, useEffect } from "react";
import { CreditCardIcon } from "@/components/icons/CreditCardIcon";
import CheckoutSummaryTable from "@/components/cart-table/CheckoutSummaryTable";

import {
  cn,
  Input,
  Radio,
  Modal,
  Button,
  Select,
  Divider,
  Textarea,
  Accordion,
  ModalBody,
  RadioGroup,
  SelectItem,
  ModalHeader,
  ModalFooter,
  Autocomplete,
  ModalContent,
  AccordionItem,
  useDisclosure,
  AutocompleteItem,
} from "@nextui-org/react";
import getCurrentUser from "@/actions/getCurrentUser";
import paths from "@/utils/api-path";

// ----------------------------------------------------------------------

const ACCORDION_ITEM_CLASS_NAMES = {
  base: "py-2",
  title: "text-xl text-primaryT-darker",
  trigger: "data-[open=true]:cursor-auto",
};

const ACCORDION_KEYS = ["1", "2", "3", "4"];

const DISTRICT_DATA = [{ label: "เมืองระยอง", value: "01" }];

const PAYMENT_TYPE_OPTIONS = [
  { value: "full", label: "เต็มจำนวน" },
  { value: "deposit", label: "มัดจำ (ชำระส่วนที่เหลือเมื่อออเดอร์เสร็จ)" },
];

const INTER_EXPRESS_ZIP_CODE_API =
  "https://api-intership.interexpress.co.th/v1/operation-areas/post-code";

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const [userData, setUserData] = useState<any>(null);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  // Email state
  const [email, setEmail] = useState("");
  // Delivery state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const [subDistrictOptions, setSubDistrictOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  // Comment state
  const [comment, setComment] = useState("");
  // Payment state
  const [selectedPaymentType, setSelectedPaymentType] = useState(["full"]);

  const { getCustomerAddress } = paths();

  // User Current Address API
  const { data: userAddressData } = useSWR(
    userData ? getCustomerAddress(userData.id) : null,
    fetcher,
  );
  // Delivery API
  const { data: locationData } = useSWR(
    zipCode.length === 5 ? `${INTER_EXPRESS_ZIP_CODE_API}/${zipCode}` : null,
    fetcher,
  );

  console.log("userAddressData", userAddressData);

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

  useEffect(() => {
    if (
      !locationData?.subDistricts ||
      !locationData?.district ||
      !locationData?.province
    )
      return;

    const subDistrictsData = locationData.subDistricts.map(
      (el: { id: any; names: { th: any } }) => ({
        value: el.names.th,
        label: el.names.th,
      }),
    );

    const districtsData = locationData.district.map(
      (el: { id: any; names: { th: any } }) => ({
        value: el.names.th,
        label: el.names.th,
      }),
    );

    const provinceData = locationData.province.map(
      (el: { id: any; names: { th: any } }) => ({
        value: el.names.th,
        label: el.names.th,
      }),
    );

    setSubDistrictOptions(subDistrictsData);
    setDistrictOptions(districtsData);
    setProvince(provinceData[0].label);
  }, [locationData]);

  useEffect(() => {
    async function getUser() {
      const currentUser = await getCurrentUser();
      console.log("currentUser", currentUser);
      setUserData(currentUser);
    }
    getUser();
  }, []);

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
            <div className="flex flex-row justify-between items-center">
              <h3>ข้อมูลผู้รับสินค้า</h3>
              <Button
                color="primary"
                variant="bordered"
                startContent={<EditIcon width={20} height={20} />}
                onPress={onOpen}
              >
                เลือกที่อยู่อื่น
              </Button>
            </div>
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
                  if (e.length <= 5) {
                    setZipCode(e);

                    const hasFetchedLocation =
                      province ||
                      subDistrictOptions.length ||
                      districtOptions.length;
                    if (e.length < 5 && hasFetchedLocation) {
                      setSubDistrict("");
                      setSubDistrictOptions([]);
                      setDistrict("");
                      setDistrictOptions([]);
                      setProvince("");
                    }
                  }
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
                items={subDistrictOptions}
                label="แขวง/ตำบล"
                variant="bordered"
                selectedKey={subDistrict}
                onSelectionChange={(selected) =>
                  setSubDistrict(selected as string)
                }
                isRequired
              >
                {(subDistrict: { value: number; label: string }) => (
                  <AutocompleteItem
                    key={subDistrict.value}
                    value={subDistrict.label}
                    className=" rounded-sm"
                  >
                    {subDistrict.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className=" flex gap-4">
              <Autocomplete
                items={districtOptions}
                label="เขต/อำเภอ"
                variant="bordered"
                selectedKey={district}
                onSelectionChange={(selected) =>
                  setDistrict(selected as string)
                }
                isRequired
              >
                {(district: { value: number; label: string }) => (
                  <AutocompleteItem
                    key={district.label}
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

            <CustomAddressModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClickEditAddress={(e) => console.log("edit:", e)}
              onClickAddAddress={(e) => console.log("add:", e)}
            />
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

export const CustomSelectAddressRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-none cursor-pointer rounded-lg gap-4 p-4 border-2",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      <span className=" text-sm">{children}</span>
    </Radio>
  );
};

const CustomAddressModal = ({
  isOpen,
  onOpenChange,
  onClickEditAddress,
  onClickAddAddress,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClickEditAddress: (selected: string) => void;
  onClickAddAddress: (selected: string) => void;
}) => {
  const [selected, setSelected] = useState("address1");
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 mt-3">
              เลือกที่อยู่อื่น
            </ModalHeader>
            <ModalBody>
              <RadioGroup value={selected} onValueChange={setSelected}>
                <CustomSelectAddressRadio
                  description="88 หมู่ที่ 8 ถนน บางนา-ตราด
                          ต. บางเสาธง, อ. บางเสาธง, สมุทรปราการ 10540"
                  value="address1"
                >
                  ปิยพนธ์ วู (097 357 5121)
                </CustomSelectAddressRadio>
                <CustomSelectAddressRadio
                  description="88 หมู่ที่ 8 ถนน บางนา-ตราด
                          ต. บางเสาธง, อ. บางเสาธง, สมุทรปราการ 10540"
                  value="address2"
                >
                  ปิยพนธ์ วู (097 357 5121)
                </CustomSelectAddressRadio>
                <CustomSelectAddressRadio
                  description="88 หมู่ที่ 8 ถนน บางนา-ตราด
                          ต. บางเสาธง, อ. บางเสาธง, สมุทรปราการ 10540"
                  value="address3"
                >
                  ปิยพนธ์ วู (097 357 5121)
                </CustomSelectAddressRadio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                fullWidth
                size="lg"
                color="primary"
                onPress={() => onClickEditAddress(selected)}
                startContent={<EditIcon />}
                variant="bordered"
                className=" gap-unit-2"
              >
                แก้ไขที่อยู่
              </Button>
              <Button
                fullWidth
                size="lg"
                color="primary"
                onPress={() => onClickAddAddress(selected)}
                startContent={<AddIcon />}
                className=" gap-unit-1"
              >
                เพิ่มที่อยู่ใหม่
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
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
