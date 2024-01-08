import mongoose from "mongoose";
import { z } from "zod";

const isNumeric = (value: string) => /^\d+$/.test(value);
const isObjectId = (value: string) => {
  return mongoose.isValidObjectId(value);
};

// Auth ----------------------------------------------------------------------

export const emailValidationSchema = z
  .string({ required_error: "Email is required." })
  .email();

export const passwordValidationSchema = z
  .string({ required_error: "Password is required." })
  .min(8)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[{\]};:<>|./?,-]).+$/,
    {
      message:
        "Password must contains at least a lowercase character, uppcase character, a number, and a special characters (!@#$%^&*_-).",
    },
  );

// Customer Address ----------------------------------------------------------

export const customerAddressValidationSchema = z.object({
  address: z.string({ required_error: "Address is required." }).min(3).max(255),
  district: z
    .string({ required_error: "District is required." })
    .min(3)
    .max(255),
  subdistrict: z
    .string({ required_error: "Subdistrict is required." })
    .min(3)
    .max(255),
  province: z
    .string({ required_error: "Province is required." })
    .min(3)
    .max(255),
  postcode: z
    .string({ required_error: "Postcode is required." })
    .length(5)
    .refine((value) => isNumeric(value), {
      message: "Postcode must contain only numbers.",
    }),
  phone: z
    .string({ required_error: "Phone is required." })
    .length(10, "Must be exactly 10 characters long")
    .refine((value) => isNumeric(value), {
      message: "Phone must contain only numbers.",
    }),
});

// Variants -------------------------------------------------------------------

export const variantValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  image: z.string().optional(),
  type: z.enum(["BASE", "FILLINGS", "FROSTINGS", "CREAM"]),
  isActive: z.boolean(),
  isVisualize: z.boolean(),
});

// Refreshments ---------------------------------------------------------------

export const refreshmentValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  image: z.string().optional(),
  category: z.enum(["BAKERY", "BEVERAGE"]),
  status: z.enum(["IN_STOCK", "LOW", "OUT_OF_STOCK"]),
  minQty: z.number({ required_error: "Min quantity is required." }),
  maxQty: z.number({ required_error: "Max quantity is required." }),
  currQty: z.number({ required_error: "Current quantity is required." }),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  price: z.number().multipleOf(0.01),
  isActive: z.boolean(),
});

// Cakes ---------------------------------------------------------------
export const cakeValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  type: z.enum(["PRESET", "CUSTOM"]),
  price: z.number().multipleOf(0.01),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  isActive: z.boolean(),
  variantIds: z.array(
    z.string().refine((val) => isObjectId(val)),
  ),
});

// Cart ------------------------------------------------------------------
export const cartCustomCakeValidationSchema = z.object({
  userId: z.string().refine((val) => isObjectId(val)),
  type: z.enum(["GUEST", "MEMBER"]),
  cakeId: z.string().refine((val) => isObjectId(val)),
  variantIds: z.array(
    z.string().refine((val) => isObjectId(val)),
  ),
  quantity: z.number()
});
