import { z } from "zod";

import { CustomFile } from "../upload";

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 50000000; // 5MB

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];

// ----------------------------------------------------------------------

export const createUpdateCakeSchema = z.object({
  image: z.any().refine(
    (files) => {
      if (typeof files === "string") {
        return true; // No need to validate if image is already a string
      } else {
        return (files?.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type)) as boolean;
      }
    },
    (val) => {
      if (val === undefined || val === null) {
        return { message: "โปรดใส่รูปภาพ" };
      } else if (val?.size > MAX_FILE_SIZE) {
        return { message: "ขนาดไฟล์เกิน 5 MB" };
      } else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(val?.type)) {
        return {
          message: "รองรับเฉพาะไฟล์ .jpg, .jpeg, .png และ .svg ",
        };
      }
      return { message: "none" };
    },
  ),
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  description: z.string().nullable(),
  price: z.number().multipleOf(0.01),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  isActive: z.boolean(),
});

export const createUpdateProductSchema = z.object({
  image: z.any().refine(
    (files) => {
      if (typeof files === "string") {
        return true; // No need to validate if image is already a string
      } else {
        return (files?.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type)) as boolean;
      }
    },
    (val) => {
      if (val === undefined || val === null) {
        return { message: "โปรดใส่รูปภาพ" };
      } else if (val?.size > MAX_FILE_SIZE) {
        return { message: "ขนาดไฟล์เกิน 5 MB" };
      } else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(val?.type)) {
        return {
          message: "รองรับเฉพาะไฟล์ .jpg, .jpeg, .png และ .svg ",
        };
      }
      return { message: "none" };
    },
  ),
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  description: z.string().nullable(),
  type: z.enum(["BAKERY", "BEVERAGE"]),
  category: z.enum(["BREAD", "PIE", "COOKIE", "SNACK", "CAKE"]).nullable(),
  minQty: z.number({ required_error: "Min quantity is required." }),
  currQty: z.number({ required_error: "Current quantity is required." }),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  price: z.number().multipleOf(0.01),
  isActive: z.boolean(),
});

export const createUpdateSnackBoxSchema = z.object({
  image: z.any().refine(
    (files) => {
      if (typeof files === "string") {
        return true; // No need to validate if image is already a string
      } else {
        return (files?.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type)) as boolean;
      }
    },
    (val) => {
      if (val === undefined || val === null) {
        return { message: "โปรดใส่รูปภาพ" };
      } else if (val?.size > MAX_FILE_SIZE) {
        return { message: "ขนาดไฟล์เกิน 5 MB" };
      } else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(val?.type)) {
        return {
          message: "รองรับเฉพาะไฟล์ .jpg, .jpeg, .png และ .svg ",
        };
      }
      return { message: "none" };
    },
  ),
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  // description: z.string().min(0).nullable(),
  price: z.number().multipleOf(0.01),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  isActive: z.boolean(),
});

export const createUpdateVariantSchema = z.object({
  image: z.any().refine(
    (files) => {
      if (typeof files === "string") {
        return true; // No need to validate if image is already a string
      } else {
        return (files?.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type)) as boolean;
      }
    },
    (val) => {
      if (val === undefined || val === null) {
        return { message: "โปรดใส่รูปภาพ" };
      } else if (val?.size > MAX_FILE_SIZE) {
        return { message: "ขนาดไฟล์เกิน 5 MB" };
      } else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(val?.type)) {
        return {
          message: "รองรับเฉพาะไฟล์ .jpg, .jpeg, .png และ .svg ",
        };
      }
      return { message: "none" };
    },
  ),
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  isActive: z.boolean(),
  type: z.string(),
});

// ----------------------------------------------------------------------

export interface IProductRow extends ICommonRow {
  type: string;
  category: string;
  status: string;
  minQty: number;
  maxQty: number;
  currQty: number;
  snackBoxId?: string | null;
  unitTypeId?: string;
  unitType: string;
}

export interface ICakeRow {
  id: string;
  description: string | null;
  name: string;
  remark?: string;
  image: CustomFile | string | null;
  price: number;
  type: "CREAM" | "TOP_EDGE" | "BOTTOM_EDGE" | "DECORATION" | "SURFACE";
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | string;
  deletedAt: string | null;
  weight: number;
  height: number;
  length: number;
  width: number;
}

export interface ISnackBoxRow extends ICommonRow {
  type: string;
  packageType: string;
  beverage: string;
  refreshments: IRefreshmentRow[];
}

export interface IVariantRow {
  creams: IVariant[];
  topEdges: IVariant[];
  bottomEdges: IVariant[];
  decorations: IVariant[];
  surfaces: IVariant[];
}

// ----------------------------------------------------------------------

interface ICommonRow {
  id: string;
  name: string;
  description: string | null;
  remark?: string | null;
  quantity?: number;
  imageFileName: string | null;
  imagePath?: string | null;
  image: CustomFile | string | null;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | string;
  deletedAt: string | null;
  weight: number;
  height: number;
  length: number;
  width: number;
}

interface IRefreshmentRow {
  id: string;
  refreshmentId: string;
  snackBoxId: string;
  refreshment: IProductRow;
}

export interface IVariant {
  id: string;
  type: "CREAM" | "TOP_EDGE" | "BOTTOM_EDGE" | "DECORATION" | "SURFACE";
  name: string;
  imageFileName: string;
  imagePath: string;
  image: CustomFile | string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface ICakeVariantRow {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}
