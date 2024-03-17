/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import Circle from "@uiw/react-color-circle";
import React, { useState, useEffect } from "react";
import { IBM_Plex_Sans_Thai } from "next/font/google";
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
  return <p className=" text-center text-sm">{name}</p>;
};

const VariantContainer = ({ title, children }: VariantContainerProps) => {
  return (
    <div>
      <div className=" mb-0">
        <p>{title}</p>
        <Divider className=" mt-2" />
      </div>
      <div className="grid grid-cols-6 items-baseline justify-between">
        {children}
      </div>
    </div>
  );
};

const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

const availableColors = AVAILABLE_COLORS.map((el) => el.code);

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
    <div className="relative">
      <div className="px-6">
        <Button color="secondary" onPress={onOpen}>
          เค้กจัดเอง
        </Button>
        <CustomCakeModal
          variants={variants}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      </div>
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
    cream: "",
    topEdge: "",
    bottomEdge: "",
    decoration: "",
    surface: "",
  });

  const [variantColorData, setVariantColorData] = useState({
    creamColor: "#FFFFFF",
    topEdgeColor: "#FFFFFF",
    bottomEdgeColor: "#FFFFFF",
  });

  const [creamImage, setCreamImage] = useState("");
  const [topEdgeImage, setTopEdgeImage] = useState("");
  const [bottomEdgeImage, setBottomEdgeImage] = useState("");
  const [decorationImage, setDecorationImage] = useState("");
  const [surfaceImage, setSurfaceImage] = useState("");

  const [selectedPound, setSelectedPound] = useState("1");
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedFilling, setSelectedFilling] = useState("");

  const updateVariantData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariantData({
      ...variantData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (Object.keys(variants).length === 0) return;
    setVariantData({
      cream: variants?.creams[0]?.id || "",
      topEdge: "",
      bottomEdge: "",
      decoration: "",
      surface: "",
    });
    setSelectedBase(variants?.bases[0]?.id || "");
    setSelectedFilling(variants?.fillings[0]?.id || "");
  }, [variants]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!variantData.cream) return;
    const currentCream = variants.creams.find(
      (el) => el.id === variantData.cream,
    );
    setCreamImage(currentCream?.image || "");
  }, [variantData.cream, variants.creams]);

  useEffect(() => {
    if (!variantData.topEdge) return;
    const currentTopEdge = variants.topEdges.find(
      (el) => el.id === variantData.topEdge,
    );
    setTopEdgeImage(currentTopEdge?.image || "");
  }, [variantData.topEdge, variants.topEdges]);

  useEffect(() => {
    if (!variantData.bottomEdge) return;
    const currentBottomEdge = variants.bottomEdges.find(
      (el) => el.id === variantData.bottomEdge,
    );
    setBottomEdgeImage(currentBottomEdge?.image || "");
  }, [variantData.bottomEdge, variants.bottomEdges]);

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
          <Radio key={el.id} value={el.name}>
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
        {variants?.creams?.map((el, index) => (
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
              <img src={el?.image || "/placeholder-image.png"} alt={el.name} />
            </label>
            <VariantLabelContainer name={el.name} />
          </div>
        ))}
      </VariantContainer>

      <VariantColorContainer title="เลือกสีครีม">
        <Circle
          colors={availableColors}
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
        {variants?.topEdges?.map((el) => (
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
              <img src={el?.image || "/placeholder-image.png"} alt={el.name} />
            </label>
            <VariantLabelContainer name={el.name} />
          </div>
        ))}
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
            colors={availableColors}
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
        {variants?.bottomEdges?.map((el) => (
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
              <img src={el?.image || "/placeholder-image.png"} alt={el.name} />
            </label>
            <VariantLabelContainer name={el.name} />
          </div>
        ))}
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
            colors={availableColors}
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
            <div
              className={`relative grid grid-cols-3 overflow-hidden ${ibm.className}`}
            >
              {/* Left-hand side */}
              <div className=" relative col-span-1 overflow-y-scroll p-6">
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
              <div className="relative col-span-2 p-6">
                {/* Right-hand side */}
                <Divider
                  orientation="vertical"
                  className=" absolute left-0 top-0"
                />
                <div className=" flex h-95p flex-col">
                  <h6 className=" text-3xl text-primaryT-main">
                    {selectedPound === "1"
                      ? "฿342"
                      : selectedPound === "2"
                        ? "฿684"
                        : "฿1,026"}
                  </h6>
                  <div className=" flex flex-1 items-center justify-center">
                    <div className=" relative flex h-2/3 w-2/3 items-center justify-center p-5">
                      {creamImage && (
                        <img
                          className="absolute z-30 w-full"
                          alt={variantData.bottomEdge}
                          src={creamImage}
                        />
                      )}
                      {topEdgeImage && (
                        <img
                          className="absolute z-30 w-full"
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
                          className="absolute z-30 w-full"
                          alt={variantData.bottomEdge}
                          src={bottomEdgeImage}
                        />
                      )}
                      {surfaceImage && (
                        <img
                          className="absolute z-30 w-full"
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
                      isDisabled
                    >
                      สินค้าหมด
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
