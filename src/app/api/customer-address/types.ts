import { z } from "zod";

export const createAddressSchema = z.object({
  address: z.string().min(1).max(255),
  district: z.string().min(1),
  subDistrict: z.string().min(1),
  province: z.string().min(1),
  code: z.string().min(1),
  phone: z
    .string()
    .length(10, { message: "Must be exactly 10 characters long" }),
});
