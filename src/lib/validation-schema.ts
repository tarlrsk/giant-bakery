import { z } from "zod";

const isNumeric = (value: string) => /^\d+$/.test(value);

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

// Customer Address ----------------------------------------------------------------------

export const customerAddressValidationSchema = z.object({
  address: z.string().min(1).max(255),
  district: z.string().min(1),
  subdistrict: z.string().min(1),
  province: z.string().min(1),
  postcode: z
    .string()
    .length(5)
    .refine((value) => isNumeric(value), {
      message: "Postcode must contain only numbers.",
    }),
  phone: z
    .string()
    .length(10, "Must be exactly 10 characters long")
    .refine((value) => isNumeric(value), {
      message: "Phone must contain only numbers.",
    }),
});
