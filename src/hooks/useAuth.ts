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
  return axios(url, {
    method: "POST",
    data: arg,
  }).then((res) => res);
}

// ----------------------------------------------------------------------

export function useAuth() {
  const { trigger: credentialSignUp } = useSWRMutation(
    "/auth/signup",
    sendRequest,
  );

  async function credentialSignIn(data: signInProps) {
    await signIn("credentials", { ...data, redirect: false });
  }

  return {
    credentialSignUp,
    credentialSignIn,
  };
}
