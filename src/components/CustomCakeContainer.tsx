/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import toast from "react-hot-toast";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import Circle from "@uiw/react-color-circle";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import React, { useMemo, useState, useEffect } from "react";
import { addCustomCakeToCart } from "@/actions/cartActions";
import { AVAILABLE_COLORS } from "@/app/(admin)/admin/variants/page";

import {
  Modal,
  Radio,
  Button,
  Divider,
  RadioGroup,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

import "./styles.css";
import { IVariant } from "./modal/types";
import { CloseIcon } from "./icons/CloseIcon";

// ----------------------------------------------------------------------

type VariantContainerProps = {
  title: string;
  children: React.ReactNode;
};
type VariantColorContainerProps = {
  title: string;
  children: React.ReactNode;
};

type IVariantData = {
  sizes: IVariant[];
  bases: IVariant[];
  fillings: IVariant[];
  creams: IVariant[];
  topEdges: IVariant[];
  decorations: IVariant[];
  bottomEdges: IVariant[];
  surfaces: IVariant[];
};

const VariantColorContainer = ({
  title,
  children,
}: VariantColorContainerProps) => {
  return (
    <div>
      <div className=" mb-4">
        <p>{title}</p>
        <Divider className=" mt-2" />
      </div>
      {children}
    </div>
  );
};

const VariantLabelContainer = ({ name }: { name: string }) => {
  return <p className=" text-center text-sm leading-relaxed">{name}</p>;
};

const VariantContainer = ({ title, children }: VariantContainerProps) => {
  return (
    <div>
      <div className=" mb-4">
        <p>{title}</p>
        <Divider className=" mt-2" />
      </div>
      <div className="grid grid-cols-5 items-baseline gap-3 ">{children}</div>
    </div>
  );
};

const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

// ----------------------------------------------------------------------

export default function CustomCakeContainer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { getVariants } = apiPaths();

  const { data } = useSWR(getVariants(), fetcher, {
    revalidateOnFocus: false,
    // revalidateOnMount: false,
    revalidateOnReconnect: false,
  });

  const variants: IVariantData = data?.response?.data || {};

  return (
    <div className=" flex flex-col items-center gap-5 py-16 md:px-36">
      <div className=" text-3xl md:text-5xl">ออกแบบเค้กเอง</div>
      <div className=" max-w-3xl text-center text-medium font-normal leading-normal md:text-xl md:leading-9">
        ยังไม่เจอเค้กที่ถูกใจ? ยังไม่เจอหน้าตาเค้กที่ใช่?
        ลองออกแบบเค้กด้วยจนเองผ่าน Cukedoh
        ที่เราได้คัดรูปแบบเค้กยอดความนิยมโดยการเลือกตัวเลือกที่คุณถูกใจได้เลย
      </div>
      <Button size="lg" radius="md" color="secondary" onPress={onOpen}>
        เริ่มออกแบบเค้กเอง
      </Button>
      <CustomCakeModal
        variants={variants}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

type CustomCakeModalProps = {
  variants: IVariantData;
  isOpen: boolean;
  onOpenChange: () => void;
};

export function CustomCakeModal({
  variants,
  isOpen,
  onOpenChange,
}: CustomCakeModalProps) {
  const [variantData, setVariantData] = useState<{
    cream: string;
    topEdge: string;
    bottomEdge: string;
    decoration: string;
    surface: string;
  }>({
    cream: "none",
    topEdge: "none",
    bottomEdge: "none",
    decoration: "",
    surface: "",
  });

  const [variantColorData, setVariantColorData] = useState({
    creamColor: "#ffffff",
    topEdgeColor: "#ffffff",
    bottomEdgeColor: "#ffffff",
  });

  const { addCustomCakeToCart: addCustomCakeToCartUrl } = apiPaths();

  const [creamImage, setCreamImage] = useState("");
  const [topEdgeImage, setTopEdgeImage] = useState("");
  const [bottomEdgeImage, setBottomEdgeImage] = useState("");
  const [decorationImage, setDecorationImage] = useState("");
  const [surfaceImage, setSurfaceImage] = useState("");

  const [selectedPound, setSelectedPound] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedFilling, setSelectedFilling] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const updateVariantData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariantData({
      ...variantData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleAddToCart() {
    const { cream, topEdge, decoration, bottomEdge, surface } = variantData;

    const { creamColor, topEdgeColor, bottomEdgeColor } = variantColorData;

    let creamId = cream;
    let topEdgeId = topEdge === "none" ? "" : topEdge;
    let bottomEdgeId = bottomEdge === "none" ? "" : bottomEdge;

    const selectedCream = variants.creams?.find((el) => el.id === cream) || "";
    const selectedTopEdge =
      variants.topEdges?.find((el) => el.id === topEdge) || "";
    const selectedBottomEdge =
      variants.bottomEdges?.find((el) => el.id === bottomEdge) || "";

    if (selectedCream && creamColor) {
      const creamColorValue = getColorValue(creamColor);

      const selectedCreamColorId =
        selectedCream?.colors?.find((el) => el.color === creamColorValue)?.id ||
        "";

      creamId = selectedCreamColorId;
    }

    if (selectedTopEdge && topEdgeColor) {
      const topEdgeColorValue = getColorValue(topEdgeColor);

      const selectedTopEdgeColorId =
        selectedTopEdge?.colors?.find((el) => el.color === topEdgeColorValue)
          ?.id || "";

      topEdgeId = selectedTopEdgeColorId;
    }

    if (selectedBottomEdge && bottomEdgeColor) {
      const bottomEdgeColorValue = getColorValue(bottomEdgeColor);

      const selectedBottomEdgeColorId =
        selectedBottomEdge?.colors?.find(
          (el) => el.color === bottomEdgeColorValue,
        )?.id || "";

      bottomEdgeId = selectedBottomEdgeColorId;
    }

    const requestBody = {
      sizeId: selectedPound,
      baseId: selectedBase,
      fillingId: selectedFilling,
      creamId: creamId,
      topEdgeId: topEdgeId,
      bottomEdgeId: bottomEdgeId,
      decorationId: decoration,
      surfaceId: surface,
      cakeMessage: "",
      quantity: 1,
    };

    setIsLoading(true);
    try {
      await addCustomCakeToCart(addCustomCakeToCartUrl(), requestBody);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (Object.keys(variants).length === 0) return;
    setVariantData({
      cream: variants?.creams[0]?.id || "",
      topEdge: "none",
      bottomEdge: "none",
      decoration: "",
      surface: "",
    });
    setSelectedPound(variants?.sizes[0]?.id || "");
    setSelectedBase(variants?.bases[0]?.id || "");
    setSelectedFilling(variants?.fillings[0]?.id || "");
  }, [variants]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!variantData.cream) return;
    const currentCream = variants.creams?.find(
      (el) => el.id === variantData.cream,
    );

    if (!currentCream) return setCreamImage("");
    // Map colored image
    const { creamColor } = variantColorData;
    const currentColor = AVAILABLE_COLORS.find(
      (color) => color.code === creamColor,
    )?.value;
    const image = currentCream?.colors?.find(
      (eachColor) => eachColor.color === currentColor,
    )?.image;

    setCreamImage(image || "");
  }, [variantColorData, variantData.cream, variants.creams]);

  useEffect(() => {
    if (!variantData.topEdge) return;
    const currentTopEdge = variants.topEdges?.find(
      (el) => el.id === variantData.topEdge,
    );
    if (!currentTopEdge) return setTopEdgeImage("");

    // Map colored image
    const { topEdgeColor } = variantColorData;
    const currentColor = AVAILABLE_COLORS.find(
      (color) => color.code === topEdgeColor,
    )?.value;
    const image = currentTopEdge?.colors?.find(
      (eachColor) => eachColor.color === currentColor,
    )?.image;
    setTopEdgeImage(image || "");
  }, [variantColorData, variantData.topEdge, variants.topEdges]);

  useEffect(() => {
    if (!variantData.bottomEdge) return;
    const currentBottomEdge = variants.bottomEdges?.find(
      (el) => el.id === variantData.bottomEdge,
    );
    if (!currentBottomEdge) return setBottomEdgeImage("");
    // Map colored image
    const { bottomEdgeColor } = variantColorData;
    const currentColor = AVAILABLE_COLORS.find(
      (color) => color.code === bottomEdgeColor,
    )?.value;
    const image = currentBottomEdge?.colors?.find(
      (eachColor) => eachColor.color === currentColor,
    )?.image;

    setBottomEdgeImage(image || "");
  }, [variantColorData, variantData.bottomEdge, variants.bottomEdges]);

  useEffect(() => {
    if (!variantData.decoration) return;
    const currentDecoration = variants.decorations.find(
      (el) => el.id === variantData.decoration,
    );
    setDecorationImage(currentDecoration?.image || "");
  }, [variantData.decoration, variants.decorations]);

  useEffect(() => {
    if (!variantData.surface) return;
    const currentSurface = variants.surfaces.find(
      (el) => el.id === variantData.surface,
    );
    setSurfaceImage(currentSurface?.image || "");
  }, [variantData.surface, variants.surfaces]);

  // ----------------------------------------------------------------------

  const availableCreamColors = useMemo(() => {
    const currentCream = variants.creams?.find(
      (cream) => cream.id === variantData.cream,
    );
    const currentCreamColors =
      currentCream?.colors?.map((eachColor) => eachColor.color) || [];
    const availableCreamColors = AVAILABLE_COLORS.filter((el) =>
      currentCreamColors.includes(el.value),
    );
    const availableCreamColorsHex = availableCreamColors.map((el) => el.code);

    return availableCreamColorsHex;
  }, [variantData.cream, variants.creams]);

  const availableTopEdgeColors = useMemo(() => {
    const currentTopEdge = variants.topEdges?.find(
      (topEdge) => topEdge.id === variantData.topEdge,
    );
    const currentTopEdgeColors =
      currentTopEdge?.colors?.map((eachColor) => eachColor.color) || [];
    const availableTopEdgeColors = AVAILABLE_COLORS.filter((el) =>
      currentTopEdgeColors.includes(el.value),
    );
    const availableCreamColorsHex = availableTopEdgeColors.map((el) => el.code);

    return availableCreamColorsHex;
  }, [variantData.topEdge, variants.topEdges]);

  const availableBottomEdgeColors = useMemo(() => {
    const currentBottomEdge = variants.bottomEdges?.find(
      (bottomEdge) => bottomEdge.id === variantData.bottomEdge,
    );
    const currentBottomEdgeColors =
      currentBottomEdge?.colors?.map((eachColor) => eachColor.color) || [];
    const availableBottomEdgeColors = AVAILABLE_COLORS.filter((el) =>
      currentBottomEdgeColors.includes(el.value),
    );
    const availableBottomEdgeColorsHex = availableBottomEdgeColors.map(
      (el) => el.code,
    );

    return availableBottomEdgeColorsHex;
  }, [variantData.bottomEdge, variants.bottomEdges]);

  // Handle reset color when variant changes ----------------------------------------------------------------------

  useEffect(() => {
    setVariantColorData((prev) => ({
      ...prev,
      creamColor: "#ffffff",
    }));
  }, [variantData.cream]);

  useEffect(() => {
    setVariantColorData((prev) => ({
      ...prev,
      topEdgeColor: "#ffffff",
    }));
  }, [variantData.topEdge]);

  useEffect(() => {
    setVariantColorData((prev) => ({
      ...prev,
      bottomEdgeColor: "#ffffff",
    }));
  }, [variantData.bottomEdge]);

  // ----------------------------------------------------------------------

  const renderStaticRadioGroup = (
    <>
      <RadioGroup
        label="เลือกขนาดปอนด์"
        orientation="horizontal"
        value={selectedPound}
        onValueChange={setSelectedPound}
        classNames={{ wrapper: "gap-4", label: "text-black" }}
      >
        <Divider />
        {variants?.sizes?.map((el) => (
          <Radio key={el.id} value={el.id}>
            {`${el.name} ปอนด์`}
          </Radio>
        ))}
      </RadioGroup>
      <RadioGroup
        label="เลือกเนื้อเค้ก"
        orientation="horizontal"
        value={selectedBase}
        onValueChange={setSelectedBase}
        classNames={{ wrapper: "gap-4", label: "text-black" }}
      >
        <Divider />

        {variants?.bases?.map((el) => (
          <Radio key={el.id} value={el.id}>
            {el.name}
          </Radio>
        ))}
      </RadioGroup>
      <RadioGroup
        label="ไส้เค้ก"
        orientation="horizontal"
        value={selectedFilling}
        onValueChange={setSelectedFilling}
        classNames={{ wrapper: "gap-4", label: "text-black" }}
      >
        <Divider />

        {variants?.fillings?.map((el) => (
          <Radio key={el.id} value={el.id}>
            {el.name}
          </Radio>
        ))}
      </RadioGroup>
    </>
  );

  const renderCream = (
    <>
      <VariantContainer title="เลือกครีม">
        {variants?.creams?.map((el, index) => {
          const image = el?.colors?.find(
            (eachColor) => eachColor.color === "WHITE",
          )?.image;
          return (
            <div
              key={el.id}
              className=" flex flex-col items-center justify-center gap-2"
            >
              <label className=" w-fit">
                <input
                  type="radio"
                  name="cream"
                  value={el.id}
                  onChange={updateVariantData}
                  defaultChecked={index === 0}
                />
                <img src={image || "/placeholder-image.png"} alt={el.name} />
              </label>
              <VariantLabelContainer name={el.name} />
            </div>
          );
        })}
      </VariantContainer>

      <VariantColorContainer title="เลือกสีครีม">
        <Circle
          colors={availableCreamColors}
          color={variantColorData.creamColor}
          onChange={(color) => {
            setVariantColorData((prev) => ({
              ...prev,
              creamColor: color.hex,
            }));
          }}
        />
      </VariantColorContainer>
    </>
  );

  const renderTopEdge = (
    <>
      <VariantContainer title="เลือกขอบบน">
        {variants?.topEdges?.map((el: IVariant) => {
          const image = el?.colors?.find(
            (eachColor) => eachColor.color === "WHITE",
          )?.image;
          return (
            <div
              key={el.id}
              className=" flex flex-col flex-wrap items-center justify-center gap-2"
            >
              <label className=" w-fit">
                <input
                  type="radio"
                  name="topEdge"
                  value={el.id}
                  onChange={updateVariantData}
                />
                <img src={image || "/placeholder-image.png"} alt={el.name} />
              </label>
              <VariantLabelContainer name={el.name} />
            </div>
          );
        })}
        <div className=" flex flex-col items-center justify-center gap-2">
          <label className=" w-fit">
            <input
              type="radio"
              name="topEdge"
              value="none"
              onChange={updateVariantData}
              defaultChecked
            />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              alt="not select"
            />
          </label>
          <VariantLabelContainer name="ไม่เลือก" />
        </div>
      </VariantContainer>

      {variantData?.topEdge !== "none" && (
        <VariantColorContainer title="เลือกสีขอบบน">
          <Circle
            colors={availableTopEdgeColors}
            color={variantColorData.topEdgeColor}
            onChange={(color) => {
              setVariantColorData((prev) => ({
                ...prev,
                topEdgeColor: color.hex,
              }));
            }}
          />
        </VariantColorContainer>
      )}
    </>
  );

  const renderDecoration = (
    <VariantContainer title="เลือกลายรอบเค้ก">
      {variants?.decorations?.map((el) => (
        <div
          key={el.id}
          className=" flex flex-col items-center justify-center gap-2"
        >
          <label className=" w-fit">
            <input
              type="radio"
              name="decoration"
              value={el.id}
              onChange={updateVariantData}
            />
            <img src={el?.image || "/placeholder-image.png"} alt={el.name} />
          </label>
          <VariantLabelContainer name={el.name} />
        </div>
      ))}
      <div className=" flex flex-col items-center justify-center gap-2">
        <label className=" w-fit">
          <input
            type="radio"
            name="decoration"
            value="none"
            onChange={updateVariantData}
            defaultChecked
          />
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            alt="not select"
          />
        </label>
        <VariantLabelContainer name="ไม่เลือก" />
      </div>
    </VariantContainer>
  );

  const renderBottomEdge = (
    <>
      <VariantContainer title="เลือกขอบล่าง">
        {variants?.bottomEdges?.map((el) => {
          const image = el?.colors?.find(
            (eachColor) => eachColor.color === "WHITE",
          )?.image;
          return (
            <div
              key={el.id}
              className=" flex flex-col items-center justify-center gap-2"
            >
              <label className=" w-fit">
                <input
                  type="radio"
                  name="bottomEdge"
                  value={el.id}
                  onChange={updateVariantData}
                />
                <img src={image || "/placeholder-image.png"} alt={el.name} />
              </label>
              <VariantLabelContainer name={el.name} />
            </div>
          );
        })}
        <div className=" flex flex-col items-center justify-center gap-2">
          <label className=" w-fit">
            <input
              type="radio"
              name="bottomEdge"
              value="none"
              onChange={updateVariantData}
              defaultChecked
            />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              alt="not select"
            />
          </label>
          <VariantLabelContainer name="ไม่เลือก" />
        </div>
      </VariantContainer>

      {variantData?.bottomEdge !== "none" && (
        <VariantColorContainer title="เลือกสีขอบล่าง">
          <Circle
            colors={availableBottomEdgeColors}
            color={variantColorData.bottomEdgeColor}
            onChange={(color) => {
              setVariantColorData((prev) => ({
                ...prev,
                bottomEdgeColor: color.hex,
              }));
            }}
          />
        </VariantColorContainer>
      )}
    </>
  );

  const renderSurface = (
    <VariantContainer title="เลือกหน้าเค้ก">
      {variants?.surfaces?.map((el, index) => (
        <div
          key={el.id}
          className=" flex flex-col items-center justify-center gap-2"
        >
          <label key={el.id} className=" w-fit">
            <input
              type="radio"
              name="surface"
              value={el.id}
              onChange={updateVariantData}
              defaultChecked={index === 0}
            />
            <img src={el?.image || "/placeholder-image.png"} alt={el.name} />
          </label>
          <VariantLabelContainer name={el.name} />
        </div>
      ))}
      <div className=" flex flex-col items-center justify-center gap-2">
        <label className=" w-fit">
          <input
            type="radio"
            name="surface"
            value="none"
            onChange={updateVariantData}
            defaultChecked
          />
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            alt="not select"
          />
        </label>
        <VariantLabelContainer name="ไม่เลือก" />
      </div>
    </VariantContainer>
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      classNames={{
        body: `${ibm.className} `,
      }}
      className=" max-h-75 w-full max-w-screen-2xl "
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* Mobile Cake */}
            <div
              className={`relative grid grid-rows-2 overflow-hidden md:grid-cols-3 md:grid-rows-none ${ibm.className}`}
            >
              <div className="relative block p-6 md:hidden">
                <Divider
                  orientation="vertical"
                  className=" absolute left-0 top-0"
                />
                <div className=" flex h-95p flex-col">
                  <div className=" flex flex-row items-center justify-between">
                    <h6 className=" text-3xl text-primaryT-main">
                      {selectedPound ===
                      variants?.sizes?.find((el) => el?.name === "1")?.id
                        ? "฿342"
                        : selectedPound ===
                            variants?.sizes?.find((el) => el?.name === "2")?.id
                          ? "฿684"
                          : "฿1,026"}
                    </h6>
                    <Button
                      isIconOnly
                      radius="full"
                      className=" bg-gray-100"
                      onClick={() => onClose()}
                    >
                      <CloseIcon width={20} height={20} color="gray" />
                    </Button>
                  </div>
                  <div className=" flex flex-1 items-center justify-center">
                    <div className=" relative flex h-2/3 w-2/3 items-center justify-center p-5">
                      {creamImage && (
                        <img
                          className="absolute z-10 w-full"
                          alt={variantData.bottomEdge}
                          src={creamImage}
                        />
                      )}
                      {topEdgeImage && (
                        <img
                          className="absolute z-20 w-full"
                          alt={variantData.bottomEdge}
                          src={topEdgeImage}
                        />
                      )}
                      {decorationImage && (
                        <img
                          className="absolute z-30 w-full"
                          alt={variantData.decoration}
                          src={decorationImage}
                        />
                      )}
                      {bottomEdgeImage && (
                        <img
                          className="absolute z-40 w-full"
                          alt={variantData.bottomEdge}
                          src={bottomEdgeImage}
                        />
                      )}
                      {surfaceImage && (
                        <img
                          className="absolute z-50 w-full"
                          alt={variantData.surface}
                          src={surfaceImage}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      color="secondary"
                      type="submit"
                      onClick={() => handleAddToCart()}
                      isLoading={isLoading}
                      className=" z-50"
                    >
                      ใส่ตะกร้า
                    </Button>
                  </div>
                </div>
              </div>

              {/* Left-hand side */}
              <div className="relative overflow-y-scroll p-6 md:col-span-1 ">
                <h6 className=" text-3xl">เค้กแต่งเอง</h6>

                <div className=" my-5 flex flex-col gap-8">
                  {renderStaticRadioGroup}

                  {variants?.creams?.length > 0 && renderCream}

                  {variants?.topEdges?.length > 0 && renderTopEdge}

                  {variants?.decorations?.length > 0 && renderDecoration}

                  {variants?.bottomEdges?.length > 0 && renderBottomEdge}

                  {variants?.surfaces?.length > 0 && renderSurface}
                </div>
              </div>

              {/* (Desktop Cake) Right-hand side */}
              <div className="relative col-span-2 hidden p-6 md:block">
                <Divider
                  orientation="vertical"
                  className=" absolute left-0 top-0"
                />
                <div className=" flex h-95p flex-col">
                  <div className=" flex flex-row items-center justify-between">
                    <h6 className=" text-3xl text-primaryT-main">
                      {selectedPound ===
                      variants?.sizes?.find((el) => el?.name === "1")?.id
                        ? "฿342"
                        : selectedPound ===
                            variants?.sizes?.find((el) => el?.name === "2")?.id
                          ? "฿684"
                          : "฿1,026"}
                    </h6>
                    <Button
                      isIconOnly
                      radius="full"
                      className=" bg-gray-100"
                      onClick={() => onClose()}
                    >
                      <CloseIcon width={20} height={20} color="gray" />
                    </Button>
                  </div>
                  <div className=" flex flex-1 items-center justify-center">
                    <div className=" relative flex h-2/3 w-2/3 items-center justify-center p-5">
                      {creamImage && (
                        <img
                          className="absolute z-10 w-full"
                          alt={variantData.bottomEdge}
                          src={creamImage}
                        />
                      )}
                      {topEdgeImage && (
                        <img
                          className="absolute z-20 w-full"
                          alt={variantData.bottomEdge}
                          src={topEdgeImage}
                        />
                      )}
                      {decorationImage && (
                        <img
                          className="absolute z-30 w-full"
                          alt={variantData.decoration}
                          src={decorationImage}
                        />
                      )}
                      {bottomEdgeImage && (
                        <img
                          className="absolute z-40 w-full"
                          alt={variantData.bottomEdge}
                          src={bottomEdgeImage}
                        />
                      )}
                      {surfaceImage && (
                        <img
                          className="absolute z-50 w-full"
                          alt={variantData.surface}
                          src={surfaceImage}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      color="secondary"
                      type="submit"
                      onClick={() => handleAddToCart()}
                      isLoading={isLoading}
                      className=" z-50"
                    >
                      ใส่ตะกร้า
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ----------------------------------------------------------------------

function getColorValue(colorHex: string) {
  return AVAILABLE_COLORS.find((color) => color.code === colorHex)?.value;
}
