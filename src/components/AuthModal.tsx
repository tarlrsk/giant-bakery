"use client";

import { z } from "zod";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  customerSignInValidationSchema,
  customerSignUpValidationSchema,
} from "@/lib/validation-schema";

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

type AuthProps = {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

type SignInProps = z.infer<typeof customerSignInValidationSchema>;

type SignUpProps = z.infer<typeof customerSignUpValidationSchema>;

// ----------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function AuthModal({ isOpen, onOpenChange }: Props) {
  const [selected, setSelected] = useState("signIn");

  const { socialSignIn } = useAuth();

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent className=" p-8">
        {() => (
          <ModalBody>
            <div>เข้าสู่ระบบด้วยบัญชี</div>
            <div className="flex items-center gap-2">
              <SocialButtons
                type="facebook"
                onClick={async () => {
                  socialSignIn("facebook");
                }}
              />
              <SocialButtons
                type="google"
                onClick={async () => {
                  socialSignIn("google");
                }}
              />
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t"></div>
              <span className="flex-shrink mx-4 text-small">หรือ</span>
              <div className="flex-grow border-t"></div>
            </div>
            {selected === "signUp" ? (
              <SignUpForm setSelected={setSelected} />
            ) : (
              <SignInForm setSelected={setSelected} />
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

// ----------------------------------------------------------------------

function SignUpForm({ setSelected }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>({
    resolver: zodResolver(customerSignUpValidationSchema),
  });

  const { credentialSignUp } = useAuth();

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  const onSubmit: SubmitHandler<SignUpProps> = async (data) => {
    try {
      await credentialSignUp(data);
    } catch (error: any) {
      const message = error?.message;
      setError(
        typeof message === "string" ? message : "กรุณาลองใหม่อีกครั้งในภายหลัง",
      );
    }
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
          isInvalid={!!errors?.email}
          errorMessage={errors.email?.message}
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

        {error && <div className="text-xs text-secondaryT-main">{error}</div>}

        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
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

function SignInForm({ setSelected }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(customerSignInValidationSchema),
  });

  const { credentialSignIn } = useAuth();

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit: SubmitHandler<SignInProps> = async (data) => {
    try {
      await credentialSignIn(data);
    } catch (error: { message: string } | any) {
      if (!error.message) return setError("กรุณาลองใหม่อีกครั้งในภายหลัง");
      setError(
        typeof error.message === "string" ? error.message : "Unexpected error",
      );
    }
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
