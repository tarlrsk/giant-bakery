import { z } from "zod";

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
    }
  );
