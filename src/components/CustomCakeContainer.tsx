/* eslint-disable @next/next/no-img-element */
"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import Circle from "@uiw/react-color-circle";
import React, { useEffect, useState } from "react";
import { IBM_Plex_Sans_Thai } from "next/font/google";

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
import { SingleFilePreview } from "./upload";

// ----------------------------------------------------------------------

const ibm = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

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

const availableColors = [
  "#F48c08", // orange
  "#aa2639", // red
  "#e388df", // pink
  "#5997bc", // light blue
  "#3780b3", // blue
  "#80c06d", // green apple
  "#7758a9", // purple
  "#2f5e1e", // dark green
  "#e6e007", // lemon
  "#443300", // brown
];

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
    creamColor: "#F48c08",
    topEdgeColor: "#F48c08",
    bottomEdgeColor: "#F48c08",
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
    console.log("currentBottomEdge", currentBottomEdge);
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
      <div>
        <div className=" mb-4">
          <p>เลือกครีม</p>
          <Divider className=" mt-2" />
        </div>
        <div className=" flex flex-row gap-3">
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
                <img
                  src={el?.image || "/placeholder-image.png"}
                  alt={el.name}
                />
              </label>
              <p className=" text-sm">{el.name}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <div>
        <div className=" mb-4">
          <p>เลือกสีครีม</p>
          <Divider className=" mt-2" />
        </div>

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
      </div> */}
    </>
  );

  const renderTopEdge = (
    <>
      <div>
        <div className=" mb-4">
          <p>เลือกขอบบน</p>
          <Divider className=" mt-2" />
        </div>
        <div className=" flex flex-row gap-5">
          {variants?.topEdges?.map((el) => (
            <div
              key={el.id}
              className=" flex flex-col items-center justify-center gap-2"
            >
              <label className=" w-fit">
                <input
                  type="radio"
                  name="topEdge"
                  value={el.id}
                  onChange={updateVariantData}
                />
                <img
                  src={el?.image || "/placeholder-image.png"}
                  alt={el.name}
                />
              </label>
              <p className=" text-sm">{el.name}</p>
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
            <p className=" text-sm">ไม่เลือก</p>
          </div>
        </div>
      </div>
      {/* {variantData?.topEdge !== "none" && (
        <div>
          <div className=" mb-4">
            <p>เลือกสีขอบบน</p>
            <Divider className=" mt-2" />
          </div>

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
        </div>
      )} */}
    </>
  );

  const renderDecoration = (
    <div>
      <div className=" mb-4">
        <p>เลือกลายรอบเค้ก</p>
        <Divider className=" mt-2" />
      </div>
      <div className=" flex flex-row gap-3">
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
            <p className=" text-sm">{el.name}</p>
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
          <p className=" text-sm">ไม่เลือก</p>
        </div>
      </div>
    </div>
  );

  const renderBottomEdge = (
    <>
      <div>
        <div className=" mb-4">
          <p>เลือกขอบล่าง</p>
          <Divider className=" mt-2" />
        </div>
        <div className=" flex flex-row gap-3">
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
                <img
                  src={el?.image || "/placeholder-image.png"}
                  alt={el.name}
                />
              </label>
              <p className=" text-sm">{el.name}</p>
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
            <p className=" text-sm">ไม่เลือก</p>
          </div>
        </div>
      </div>
      {/* {variantData?.bottomEdge !== "none" && (
        <div>
          <div className=" mb-4">
            <p>เลือกสีขอบล่าง</p>
            <Divider className=" mt-2" />
          </div>

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
        </div>
      )} */}
    </>
  );

  const renderSurface = (
    <div>
      <div className=" mb-4">
        <p>เลือกหน้าเค้ก</p>
        <Divider className=" mt-2" />
      </div>
      <div className=" flex flex-row gap-3">
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
            <p className=" text-sm">{el.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      classNames={{
        body: `${ibm.className} `,
      }}
      className=" max-w-screen-2xl w-full max-h-75 "
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div
              className={`grid grid-cols-3 relative overflow-hidden ${ibm.className}`}
            >
              {/* Left-hand side */}
              <div className=" col-span-1 relative p-6 overflow-y-scroll">
                <h6 className=" text-3xl">เค้กแต่งเอง</h6>

                <div className=" flex flex-col my-5 gap-8">
                  {renderStaticRadioGroup}

                  {variants?.creams?.length > 0 && renderCream}

                  {variants?.topEdges?.length > 0 && renderTopEdge}

                  {variants?.decorations?.length > 0 && renderDecoration}

                  {variants?.bottomEdges?.length > 0 && renderBottomEdge}

                  {variants?.surfaces?.length > 0 && renderSurface}
                </div>
              </div>
              <div className="col-span-2 p-6 relative">
                {/* Right-hand side */}
                <Divider
                  orientation="vertical"
                  className=" absolute top-0 left-0"
                />
                <div className=" flex flex-col h-95p">
                  <h6 className=" text-3xl text-primaryT-main">
                    {selectedPound === "1"
                      ? "฿250"
                      : selectedPound === "2"
                        ? "฿500"
                        : "฿750"}
                  </h6>
                  <div className=" flex flex-1 justify-center items-center">
                    <div className=" flex justify-center items-center p-5 relative h-2/3 w-2/3">
                      {creamImage && (
                        // <div
                        //   className="w-full h-full absolute z-0"
                        //   style={{
                        //     backgroundColor: `${variantColorData.creamColor}`,
                        //     WebkitMaskImage: `url(${creamImage}) no-repeat 50% 50%`,
                        //     mask: `url(${creamImage}) no-repeat 50% 50%`,
                        //     maskSize: "cover",
                        //     WebkitMaskSize: "cover",
                        //   }}
                        // />
                        <img
                          className="w-full absolute z-30"
                          alt={variantData.bottomEdge}
                          src={creamImage}
                        />
                      )}
                      {topEdgeImage && (
                        // <div
                        //   className="w-full h-full absolute z-10"
                        //   style={{
                        //     backgroundColor: `${variantColorData.topEdgeColor}`,
                        //     WebkitMaskImage: `url(${topEdgeImage}) no-repeat 50% 50%`,
                        //     mask: `url(${topEdgeImage}) no-repeat 50% 50%`,
                        //     maskSize: "cover",
                        //     WebkitMaskSize: "cover",
                        //   }}
                        // />
                        <img
                          className="w-full absolute z-30"
                          alt={variantData.bottomEdge}
                          src={topEdgeImage}
                        />
                      )}
                      {decorationImage && (
                        <img
                          className="w-full absolute z-30"
                          alt={variantData.decoration}
                          src={decorationImage}
                        />
                      )}
                      {bottomEdgeImage && (
                        // <div
                        //   className="w-full h-full absolute z-20"
                        //   style={{
                        //     backgroundColor: `${variantColorData.bottomEdgeColor}`,
                        //     WebkitMaskImage: `url(${bottomEdgeImage}) no-repeat 50% 50%`,
                        //     mask: `url(${bottomEdgeImage}) no-repeat 50% 50%`,
                        //     maskSize: "cover",
                        //     WebkitMaskSize: "cover",
                        //   }}
                        // />
                        <img
                          className="w-full absolute z-30"
                          alt={variantData.bottomEdge}
                          src={bottomEdgeImage}
                        />
                      )}
                      {surfaceImage && (
                        <img
                          className="w-full absolute z-30"
                          alt={variantData.surface}
                          src={surfaceImage}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
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
