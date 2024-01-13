"use client";

import { z } from "zod";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  customerSignInValidationSchema,
  customerSignUpValidationSchema,
} from "@/lib/validationSchema";

import {
  Link,
  Modal,
  Input,
  Button,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";

import Iconify from "./Iconify";
import SocialButtons from "./SocialButtons";

// ----------------------------------------------------------------------

const ERRORS_SET = { alreadyHasUser: "อีเมลนี้ถูกใช้งานแล้ว" };

// ----------------------------------------------------------------------

type AuthProps = {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  onSuccess: () => void;
};

type SignInProps = z.infer<typeof customerSignInValidationSchema>;

type SignUpProps = z.infer<typeof customerSignUpValidationSchema>;

// ----------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function AuthModal({ isOpen, onOpenChange }: Props) {
  const router = useRouter();
  const { onSignIn } = useAuth();

  const [isLoadingFacebookAuth, setIsLoadingFacebookAuth] = useState(false);
  const [isLoadingGoogleAuth, setIsLoadingGoogleAuth] = useState(false);
  const [selected, setSelected] = useState("signIn");

  function onSuccess(authType: "signIn" | "signUp", onClose: () => void) {
    toast.success(
      authType === "signIn" ? "เข้าสู่ระบบสำเร็จ" : "สมัครบัญชีสำเร็จ",
    );
    router.refresh();
    onClose();
  }

  function onError() {
    toast.error("กรุณาลองใหม่");
  }

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent className=" p-8">
        {(onClose) => (
          <ModalBody>
            <div>เข้าสู่ระบบด้วยบัญชี</div>
            <div className="flex items-center gap-2">
              <SocialButtons
                type="facebook"
                isLoading={isLoadingFacebookAuth}
                onClick={() =>
                  onSignIn(
                    "facebook",
                    setIsLoadingFacebookAuth,
                    () => onSuccess("signIn", onClose),
                    onError,
                  )
                }
              />
              <SocialButtons
                type="google"
                isLoading={isLoadingGoogleAuth}
                onClick={() =>
                  onSignIn(
                    "google",
                    setIsLoadingGoogleAuth,
                    () => onSuccess("signIn", onClose),
                    onError,
                  )
                }
              />
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t"></div>
              <span className="flex-shrink mx-4 text-small">หรือ</span>
              <div className="flex-grow border-t"></div>
            </div>
            {selected === "signUp" ? (
              <SignUpForm
                setSelected={setSelected}
                onSuccess={() => onSuccess("signUp", onClose)}
              />
            ) : (
              <SignInForm
                setSelected={setSelected}
                onSuccess={() => onSuccess("signIn", onClose)}
              />
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

// ----------------------------------------------------------------------

function SignUpForm({ setSelected, onSuccess }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>({
    resolver: zodResolver(customerSignUpValidationSchema),
  });

  const { onSignUp } = useAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);
  const onSubmit: SubmitHandler<SignUpProps> = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await onSignUp(data);
      onSuccess();
    } catch (error: any) {
      setError(
        typeof error?.message === "string"
          ? error.message
          : "กรุณาลองใหม่อีกครั้งในภายหลัง",
      );
    }
    setIsLoading(false);
  };

  return (
    <>
      <h1>สมัครบัญชีด้วยอีเมล</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          {...register("email", { required: true })}
          autoFocus
          label="อีเมล"
          placeholder="อีเมล"
          labelPlacement="outside"
          variant="bordered"
          type="email"
          isInvalid={!!errors?.email || error === ERRORS_SET.alreadyHasUser}
          errorMessage={
            errors.email?.message ||
            (error === ERRORS_SET.alreadyHasUser && error)
          }
        />

        <Input
          {...register("password")}
          label="พาสเวิร์ด"
          placeholder="พาสเวิร์ด"
          labelPlacement="outside"
          variant="bordered"
          endContent={
            <PasswordToggleButton
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          }
          type={isVisible ? "text" : "password"}
          isInvalid={!!errors?.password}
          errorMessage={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          label="ยืนยันพาสเวิร์ด"
          placeholder="ยืนยันพาสเวิร์ด"
          labelPlacement="outside"
          variant="bordered"
          endContent={
            <PasswordToggleButton
              isVisible={isVisibleConfirm}
              toggleVisibility={toggleVisibilityConfirm}
            />
          }
          type={isVisibleConfirm ? "text" : "password"}
          isInvalid={!!errors?.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />

        <Input
          {...register("phone")}
          label="หมายเลขโทรศัพท์"
          placeholder="หมายเลขโทรศัพท์"
          labelPlacement="outside"
          variant="bordered"
          type="tel"
          isInvalid={!!errors?.phone}
          errorMessage={errors.phone?.message}
        />

        {!Object.values(ERRORS_SET).some((error) => error === error) && (
          <div className={` text-xs text-secondaryT-main`}>{error}</div>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            isLoading={isLoading}
            color="secondary"
            style={{ height: "2.75rem", fontSize: "1rem" }}
            type="submit"
          >
            สมัครบัญชี
          </Button>
        </div>

        <p className="text-center text-small">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            size="sm"
            color="secondary"
            style={{ cursor: "pointer" }}
            onPress={() => setSelected("signIn")}
          >
            เข้าสู่ระบบเลย
          </Link>
        </p>
      </form>
    </>
  );
}

// ----------------------------------------------------------------------

function SignInForm({ setSelected, onSuccess }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(customerSignInValidationSchema),
  });

  const { onSignIn } = useAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit: SubmitHandler<SignInProps> = (data) => {
    onSignIn(
      "credentials",
      setIsLoading,
      onSuccess,
      () => setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง"),
      data,
    );
  };

  return (
    <>
      <h1 className=" text-primaryT-darker">เข้าสู่ระบบด้วยอีเมล</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Input
            {...register("email", { required: true })}
            autoFocus
            color="default"
            label="อีเมล"
            placeholder="อีเมล"
            labelPlacement="outside"
            variant="bordered"
            type="email"
            isInvalid={!!errors.email || !!error}
            errorMessage={errors.email?.message}
          />
        </div>
        <div style={{ position: "relative" }}>
          <Input
            {...register("password")}
            label="พาสเวิร์ด"
            placeholder="พาสเวิร์ด"
            labelPlacement="outside"
            variant="bordered"
            endContent={
              <PasswordToggleButton
                isVisible={isVisible}
                toggleVisibility={toggleVisibility}
              />
            }
            type={isVisible ? "text" : "password"}
            isInvalid={!!errors?.password || !!error}
            errorMessage={errors.password?.message || error}
          />
          <Link
            size="sm"
            color="secondary"
            style={{
              position: "absolute",
              right: 0,
              top: -2,
              cursor: "pointer",
            }}
            onPress={() => setSelected("signUp")}
          >
            ลืมพาสเวิร์ด?
          </Link>
        </div>

        {error && <div className="text-xs text-dangerT-main">{error}</div>}

        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            isLoading={isLoading}
            color="secondary"
            className=" h-11 text-base"
            type="submit"
          >
            เข้าสู่ระบบ
          </Button>
        </div>

        <p className="text-center text-small">
          ยังไม่มีบัญชี?{" "}
          <Link
            size="sm"
            color="secondary"
            style={{ cursor: "pointer" }}
            onPress={() => setSelected("signUp")}
          >
            สมัครเลย
          </Link>
        </p>
      </form>
    </>
  );
}

// ----------------------------------------------------------------------

function PasswordToggleButton({
  isVisible,
  toggleVisibility,
}: {
  isVisible: boolean;
  toggleVisibility: () => void;
}) {
  return (
    <button
      className="focus:outline-none"
      type="button"
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <Iconify icon="tabler:eye-filled" className=" text-gray-500" />
      ) : (
        <Iconify icon="ph:eye-slash-fill" className=" text-gray-500" />
      )}
    </button>
  );
}
