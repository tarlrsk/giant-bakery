import { z } from "zod";
import axios from "@/utils/axios";
import { signIn } from "next-auth/react";
import useSWRMutation from "swr/mutation";
import {
  customerSignInValidationSchema,
  customerSignUpValidationSchema,
} from "@/lib/validation-schema";

// ----------------------------------------------------------------------

type signUpProps = z.infer<typeof customerSignUpValidationSchema>;

type signInProps = z.infer<typeof customerSignInValidationSchema>;

async function sendRequest(
  url: string,
  { arg }: { arg: signUpProps | signInProps },
) {
  await axios(url, {
    method: "POST",
    data: arg,
  })
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        return "Unexpected error";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        return "Unexpected error";
      }
    });
}

// ----------------------------------------------------------------------

export function useAuth() {
  const { trigger: credentialSignUp } = useSWRMutation(
    "/auth/signup",
    sendRequest,
  );

  async function credentialSignIn(data: signInProps) {
    await signIn("credentials", { ...data, redirect: false })
      .then((res) => {
        if (res?.status === 401) {
          throw new Error("อีเมลหรือพาสเวิร์ดไม่ถูกต้อง");
        } else {
          return res?.status;
        }
      })
      .catch((error) => {
        throw new Error(
          typeof error.message === "string"
            ? error.message
            : "Unexpected error",
        );
      });
  }

  async function socialSignIn(type: "facebook" | "google") {
    await signIn(type, { redirect: false })
      .then((res) => {
        if (res?.status === 401) {
          throw new Error("invalid");
        } else {
          return res?.status;
        }
      })
      .catch((error) => {
        throw new Error(
          typeof error.message === "string"
            ? error.message
            : "Unexpected error",
        );
      });
  }

  return {
    credentialSignUp,
    credentialSignIn,
    socialSignIn,
  };
}
