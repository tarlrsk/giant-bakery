import useSWRMutation from "swr/mutation";

import axios from "@/utils/axios";

import { z } from "zod";
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
  const { trigger: credentialSignIn } = useSWRMutation(
    "/auth/signin",
    sendRequest,
  );
  // TODO: social media authentication

  return {
    credentialSignUp,
    credentialSignIn,
  };
}
