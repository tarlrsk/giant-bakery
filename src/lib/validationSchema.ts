import { z } from "zod";
import mongoose from "mongoose";

const isNumeric = (value: string) => /^\d+$/.test(value);

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const zodIsObjectId = (zString: z.ZodString) => {
  return zString.refine((val) => {
    if (!mongoose.isValidObjectId(val)) {
      return false;
    }
    return true;
  }, "Invalid ObjectId");
};

// Auth ----------------------------------------------------------------------

export const customerSignUpValidationSchema = z
  .object({
    email: z.string().min(1, "กรุณาใส่อีเมล").email("กรุณาใส่อีเมลที่ถูกต้อง"),

    password: z
      .string({ required_error: "กรุณาใส่รหัสผ่าน" })
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z
      .string({ required_error: "กรุณาใส่รหัสผ่าน" })
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    phone: z
      .string({ required_error: "กรุณาใส่เบอร์โทรศัพท์" })
      .min(10, "เบอร์โทรศัพท์ต้องมี 10 ตัวเลขเท่านั้น")
      .max(10, "เบอร์โทรศัพท์ต้องมี 10 ตัวเลขเท่านั้น")
      .regex(phoneRegex, "กรุณาใส่เบอร์โทรศัพท์ที่ถูกต้อง"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน กรุณาใส่รหัสผ่านอีกครั้ง",
    path: ["confirmPassword"],
  });

export const customerSignInValidationSchema = z.object({
  email: z.string().min(1, "กรุณาใส่อีเมล").email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

// Customer Address ----------------------------------------------------------

export const customerAddressValidationSchema = z.object({
  cFirstName: z
    .string({ required_error: "First name is required." })
    .min(3)
    .max(255),
  cLastName: z
    .string({ required_error: "Last name is required." })
    .min(3)
    .max(255),
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
  isVisualized: z.boolean(),
});

// Refreshments ---------------------------------------------------------------

export const refreshmentValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  description: z.string().min(10).max(255),
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
    z.string().refine((val) => {
      return mongoose.isValidObjectId(val);
    }),
  ),
});

// Cart ------------------------------------------------------------------

export const cartCustomCakeValidationSchema = z.object({
  userId: zodIsObjectId(z.string()),
  type: z.enum(["GUEST", "MEMBER"]),
  cakeId: zodIsObjectId(z.string()),
  variantIds: z.array(zodIsObjectId(z.string())),
  quantity: z.number(),
});

export const cartPresetCakeValidationSchema = z.object({
  userId: zodIsObjectId(z.string()),
  type: z.enum(["GUEST", "MEMBER"]),
  cakeId: zodIsObjectId(z.string()),
  quantity: z.number(),
});

export const cartRefreshmentValidationSchema = z.object({
  userId: zodIsObjectId(z.string()),
  type: z.enum(["GUEST", "MEMBER"]),
  refreshmentId: zodIsObjectId(z.string()),
  quantity: z.number(),
});

export const cartSnackBoxValidationSchema = z.object({
  userId: zodIsObjectId(z.string()),
  type: z.enum(["GUEST", "MEMBER"]),
  refreshmentIds: z.array(zodIsObjectId(z.string())),
  quantity: z.number(),
});

export const updateQtyCartValidateSchema = z.object({
  userId: zodIsObjectId(z.string()),
  type: z.enum(["PRESET_CAKE", "CUSTOM_CAKE", "REFRESHMENT", "SNACK_BOX"]),
  itemId: zodIsObjectId(z.string()),
  quantity: z.number(),
});

// Discount -------------------------------------------------------------

export const discountValidationSchema = z.object({
  condition: z
    .string({ required_error: "Condition is required." })
    .min(3)
    .max(255),
  pct: z
    .string({ required_error: "Discount percentage is required." })
    .min(3)
    .max(255),
  type: z.enum(["NORMAL", "SNACK_BOX"]),
  isActive: z.boolean(),
});
