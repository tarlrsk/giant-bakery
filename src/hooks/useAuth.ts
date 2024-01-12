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
        throw new Error(error.response.data.response.error);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error("Unexpected error");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Unexpected error");
      }
    });
}

// ----------------------------------------------------------------------

export function useAuth() {
  const { trigger: onSignUp } = useSWRMutation("/auth/signup", sendRequest);

  async function onSignIn(
    type: "credentials" | "facebook" | "google",
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void,
    onError: () => void,
    data?: signInProps,
  ) {
    setIsLoading(true);

    if (type === "credentials") {
      await signIn(type, { ...data, redirect: false }).then((callback) => {
        setIsLoading(false);

        if (callback?.ok) {
          onSuccess();
        }

        if (callback?.error) {
          onError();
        }
      });
    } else {
      await signIn(type, { redirect: false }).then((callback) => {
        setIsLoading(false);

        if (callback?.ok) {
          onSuccess();
        }

        if (callback?.error) {
          onError();
        }
      });
    }
  }

  return {
    onSignUp,
    onSignIn,
  };
}
