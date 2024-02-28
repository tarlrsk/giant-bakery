import { z } from "zod";
import { signIn, signOut } from "next-auth/react";
import { signUp, ISignUpRequest } from "@/actions/userActions";
import { signInValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

type signInProps = z.infer<typeof signInValidationSchema>;

// ----------------------------------------------------------------------

export function useAuth() {
  async function onSignUp(body: ISignUpRequest) {
    try {
      const res = await signUp(body);
      if (!res.response.success) {
        throw Object(res);
      } else {
        await signIn("credentials", { ...body, redirect: false });
        return res.response;
      }
    } catch (error: any) {
      if (error.response.data) {
        throw new Error(error.response.data.response.error);
      } else if (error.response.error) {
        throw new Error(error.response.error);
      } else {
        throw new Error("Unexpected error");
      }
    }
  }

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

  async function onSignOut() {
    await signOut({ callbackUrl: "/" });
  }

  return {
    onSignUp,
    onSignIn,
    onSignOut,
  };
}
