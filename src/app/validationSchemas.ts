import { z } from "zod";

// Customer Address ----------------------------------------------------------------------

export const createAddressSchema = z.object({
  address: z.string().min(1).max(255),
  district: z.string().min(1),
  subDistrict: z.string().min(1),
  province: z.string().min(1),
  code: z.string().length(5),
  phone: z.string().length(10, "Must be exactly 10 characters long"),
});
