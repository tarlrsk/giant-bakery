"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import paths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import useSWRMutation from "swr/mutation";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import AddIcon from "@/components/icons/AddIcon";
import getCurrentUser from "@/actions/userActions";
import { EditIcon } from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
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

// ----------------------------------------------------------------------

type ICheckout = {
  addressId: string;
  userId: string;
  paymentMethod: "CARD" | "PROMPTPAY";
  paymentType: string;
  remark: string;
};

const ACCORDION_ITEM_CLASS_NAMES = {
  base: "py-2",
  title: "text-xl text-primaryT-darker",
  trigger: "data-[open=true]:cursor-auto",
};

const ACCORDION_KEYS = ["1", "2", "3", "4"];

const PAYMENT_TYPE_OPTIONS = [
  { value: "SINGLE", label: "เต็มจำนวน" },
  { value: "INSTALLMENT", label: "มัดจำ (ชำระส่วนที่เหลือเมื่อออเดอร์เสร็จ)" },
];

async function sendCreateCustomerAddressRequest(
  url: string,
  {
    arg,
  }: {
    arg: {
      cFirstName: string;
      cLastName: string;
      address: string;
      district: string;
      subdistrict: string;
      province: string;
      postcode: string;
      phone: string;
    };
  },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

async function sendUpdateCustomerAddressRequest(
  url: string,
  {
    arg,
  }: {
    arg: {
      addressId: string;
      cFirstName: string;
      cLastName: string;
      address: string;
      district: string;
      subdistrict: string;
      province: string;
      postcode: string;
      phone: string;
    };
  },
) {
  await fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

async function sendDeleteCustomerAddressRequest(
  url: string,
  { arg }: { arg: { addressId: string } },
) {
  await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

async function sendCheckoutRequest(
  url: string,
  {
    arg,
  }: {
    arg: {
      addressId: string;
      userId: string;
      paymentMethod: string;
      paymentType: string;
      remark: string;
    };
  },
) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  const data = await response.json();
  return data;
}

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const [userData, setUserData] = useState<any>(null);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  // Email state
  const [email, setEmail] = useState("");
  // Delivery state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentAddressAction, setCurrentAddressAction] = useState<
    "add" | "update"
  >("add");
  const [selectedAddressId, setSelectedAddressId] = useState("");
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "CARD" | "PROMPTPAY"
  >("PROMPTPAY");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string[]>([
    "SINGLE",
  ]);

  const {
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    addCheckoutOrder,
    getInterExpressLocation,
  } = paths();

  // User Current Address API
  const { data: userAddressData } = useSWR(
    userData ? getCustomerAddress(userData.id) : null,
    fetcher,
  );
  const {
    trigger: triggerCreateCustomerAddress,
    isMutating: isMutatingCreateCustomerAddress,
  } = useSWRMutation(
    userData ? createCustomerAddress(userData.id) : null,
    sendCreateCustomerAddressRequest,
  );
  const {
    trigger: triggerUpdateCustomerAddress,
    isMutating: isMutatingUpdateCustomerAddress,
  } = useSWRMutation(
    userData ? updateCustomerAddress(userData.id) : null,
    sendUpdateCustomerAddressRequest,
  );
  const { trigger: triggerDeleteCustomerAddress } = useSWRMutation(
    userData ? deleteCustomerAddress(userData.id) : null,
    sendDeleteCustomerAddressRequest,
  );

  const currentUserAddresses: {
    id: string;
    cFirstName: string;
    cLastName: string;
    address: string;
    district: string;
    subdistrict: string;
    province: string;
    postcode: string;
    phone: string;
    userId: string;
  }[] = userAddressData?.response?.data || [];

  // Delivery API
  const { data: locationData } = useSWR(
    zipCode.length === 5 ? getInterExpressLocation(zipCode) : null,
    fetcher,
  );

  // Checkout API
  const {
    trigger: triggerAddCheckoutOrder,
    isMutating: isMutatingAddCheckoutOrder,
  } = useSWRMutation(addCheckoutOrder(), sendCheckoutRequest);

  async function handleCheckout() {
    const body: ICheckout = {
      addressId: selectedAddressId,
      userId: userData?.id,
      paymentMethod: selectedPaymentMethod,
      paymentType: selectedPaymentType[0],
      remark: comment,
    };

    try {
      const res = await triggerAddCheckoutOrder(body);
      const url = res?.response?.data?.stripeUrl;
      router.replace(url);
    } catch (error: any) {
      console.error(error.errorMessage);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

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
    async function getUserData() {
      const currentUser = await getCurrentUser();
      setUserData(currentUser);
    }
    getUserData();
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
              {currentUserAddresses.length > 0 && (
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<EditIcon width={20} height={20} />}
                  onPress={onOpen}
                >
                  เลือกที่อยู่อื่น
                </Button>
              )}
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
          isLoading={
            isMutatingCreateCustomerAddress || isMutatingUpdateCustomerAddress
          }
          onClickButton={async () => {
            if (selectedDeliveryOption === "delivery") {
              if (
                firstName &&
                lastName &&
                phone &&
                address &&
                subDistrict &&
                district
              ) {
                try {
                  if (currentAddressAction === "update") {
                    await triggerUpdateCustomerAddress({
                      addressId: selectedAddressId,
                      cFirstName: firstName,
                      cLastName: lastName,
                      address: address,
                      district: district,
                      subdistrict: subDistrict,
                      province: province,
                      postcode: zipCode,
                      phone: phone,
                    });
                  } else {
                    await triggerCreateCustomerAddress({
                      cFirstName: firstName,
                      cLastName: lastName,
                      address: address,
                      district: district,
                      subdistrict: subDistrict,
                      province: province,
                      postcode: zipCode,
                      phone: phone,
                    });
                  }
                  handleGoNextSection("2");
                } catch (error) {
                  toast("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง");
                }
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
        defaultValue="PROMPTPAY"
        className="mt-1 mb-4"
        classNames={{ wrapper: "md:flex-row" }}
        onValueChange={(selected) => {
          setSelectedPaymentMethod(selected as "PROMPTPAY" | "CARD");
        }}
      >
        <CustomPaymentRadio value="PROMPTPAY">
          <div className="flex flex-row items-center gap-4">
            <QRCodeIcon
              width={40}
              height={40}
              className=" text-disabled group-data-[selected=true]:text-primaryT-main pb-0.5"
            />
            ชำระผ่าน QR Code
          </div>
        </CustomPaymentRadio>
        <CustomPaymentRadio value="CARD">
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
        defaultSelectedKeys={["SINGLE"]}
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
      <ConfirmButton
        onClickButton={() => {
          handleCheckout();
        }}
        isLoading={isMutatingAddCheckoutOrder}
      />
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
              userAddresses={currentUserAddresses}
              onClickEditAddress={(addressId) => {
                const selectedAddress = currentUserAddresses.find(
                  (address: { id: string }) => address.id === addressId,
                );
                setFirstName(selectedAddress?.cFirstName || "");
                setLastName(selectedAddress?.cLastName || "");
                setPhone(selectedAddress?.phone || "");
                setAddress(selectedAddress?.address || "");
                setZipCode(selectedAddress?.postcode || "");
                setSubDistrict(selectedAddress?.subdistrict || "");
                setDistrict(selectedAddress?.district || "");
                setProvince(selectedAddress?.province || "");
                setCurrentAddressAction("update");
                setSelectedAddressId(addressId);
              }}
              onClickAddAddress={() => {
                setFirstName("");
                setLastName("");
                setPhone("");
                setAddress("");
                setZipCode("");
                setSubDistrict("");
                setDistrict("");
                setProvince("");
                setCurrentAddressAction("add");
              }}
              onClickDeleteAddress={async (addressId, onClose) => {
                try {
                  await triggerDeleteCustomerAddress({ addressId });
                  mutate(createCustomerAddress(userData.id));
                  onClose();
                  toast.success("ลบที่อยู่สำเร็จ");
                } catch (error) {
                  console.error(error);
                  toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

const ConfirmButton = ({
  onClickButton,
  isLoading = false,
}: {
  onClickButton: () => void;
  isLoading?: boolean;
}) => {
  return (
    <Button
      color="secondary"
      isLoading={isLoading}
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

const CustomSelectAddressRadio = (props: any) => {
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
  onClickDeleteAddress,
  userAddresses,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClickAddAddress: () => void;
  onClickEditAddress: (selected: string) => void;
  onClickDeleteAddress: (selected: string, onClose: () => void) => void;
  userAddresses: {
    id: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postcode: string;
    cFirstName: string;
    cLastName: string;
    phone: string;
  }[];
}) => {
  const [selected, setSelected] = useState("address1");
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      className="py-2"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1 items-center justify-between">
              เลือกที่อยู่อื่น
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClickDeleteAddress(selected, onClose);
                }}
                startContent={<DeleteIcon />}
                className=" gap-unit-1 hover:!bg-transparent hover:text-opacity-75"
              >
                ลบที่อยู่
              </Button>
            </ModalHeader>
            <ModalBody>
              <RadioGroup value={selected} onValueChange={setSelected}>
                {userAddresses.map((eachAddress) => (
                  <CustomSelectAddressRadio
                    key={eachAddress.id}
                    description={`${eachAddress.address} ต. ${eachAddress.subdistrict} อ. ${eachAddress.district}, ${eachAddress.province} ${eachAddress.postcode}`}
                    value={eachAddress.id}
                  >
                    {`${eachAddress.cFirstName} ${eachAddress.cLastName} (${eachAddress.phone})`}
                  </CustomSelectAddressRadio>
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter className="flex flex-col">
              <Button
                color="primary"
                variant="bordered"
                size="md"
                onPress={() => {
                  onClickAddAddress();
                  onClose();
                }}
                startContent={<AddIcon />}
                className=" gap-unit-1"
              >
                เพิ่มที่อยู่
              </Button>
              <Button
                fullWidth
                size="md"
                color="primary"
                onPress={() => {
                  onClickEditAddress(selected);
                  onClose();
                }}
                // In case design changes
                // startContent={<EditIcon />}
                className=" gap-unit-2"
              >
                ยืนยัน
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
