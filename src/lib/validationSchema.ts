import { z } from "zod";
const isNumeric = (value: string) => /^\d+$/.test(value);

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const MAX_FILE_SIZE = 50000000; //kilobytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const zodIsImage = z
  .any()
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 50MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported.",
  );

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
  image: zodIsImage.nullable(),
  type: z.enum(["BASE", "FILLINGS", "FROSTINGS", "CREAM"]),
  isActive: z.boolean(),
  isVisualized: z.boolean(),
});

// Refreshments ---------------------------------------------------------------

export const refreshmentValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(3).max(255),
  description: z.string().min(10).max(255).nullable(),
  image: zodIsImage.nullable(),
  type: z.enum(["BAKERY", "BEVERAGE"]),
  category: z.enum(["BREAD", "PIE", "COOKIE", "SNACK"]).nullable(),
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
  description: z.string().min(10).max(255).nullable(),
  image: zodIsImage.nullable(),
  type: z.enum(["PRESET", "CUSTOM"]),
  price: z.number().multipleOf(0.01),
  weight: z.number().multipleOf(0.01),
  height: z.number().multipleOf(0.01),
  length: z.number().multipleOf(0.01),
  width: z.number().multipleOf(0.01),
  isActive: z.boolean(),
  variantIds: z.array(z.string().uuid()),
});

// Cart ------------------------------------------------------------------

export const cartCustomCakeValidationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["GUEST", "MEMBER"]),
  cakeId: z.string(),
  variantIds: z.array(z.string()),
  quantity: z.number(),
});

export const cartPresetCakeValidationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["GUEST", "MEMBER"]),
  cakeId: z.string().uuid(),
  quantity: z.number(),
});

export const cartRefreshmentValidationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["GUEST", "MEMBER"]),
  refreshmentId: z.string(),
  quantity: z.number(),
});

export const cartSnackBoxValidationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["GUEST", "MEMBER"]),
  refreshmentIds: z.array(z.string().uuid()),
  quantity: z.number(),
});

export const updateQtyCartValidateSchema = z.object({
  userId: z.string().uuid(),
  itemId: z.string(),
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
