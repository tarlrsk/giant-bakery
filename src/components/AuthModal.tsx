"use client";

import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  Link,
} from "@nextui-org/react";

import { EyeFilledIcon } from "./svg/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./svg/EyeSlashFilledIcon";

// ----------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function AuthModal({ isOpen, onOpenChange }: Props) {
  const [selected, setSelected] = useState("login");

  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="p-6">
        {(onClose) => (
          <>
            <Tabs
              fullWidth
              size="lg"
              variant="underlined"
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
            >
              <Tab key="register" title="สมัครบัญชีใหม่" />
              <Tab key="login" title="เข้าสู่ระบบ" />
            </Tabs>
            <ModalBody className="pt-6">
              {selected === "register" ? (
                <RegisterForm setSelected={setSelected} />
              ) : (
                <LoginForm setSelected={setSelected} />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ----------------------------------------------------------------------

type AuthForm = {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

function RegisterForm({ setSelected }: AuthForm) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <h1>เข้าสู่ระบบด้วยบัญชี</h1>

      <form className="flex flex-col gap-5">
        <div>
          <Input
            isRequired
            label="อีเมล"
            placeholder="Enter your email"
            labelPlacement="outside"
            variant="bordered"
            type="email"
          />
        </div>

        <div style={{ position: "relative" }}>
          <Input
            isRequired
            label="พาสเวิร์ด"
            placeholder="Enter your password"
            labelPlacement="outside"
            variant="bordered"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
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
            onPress={() => setSelected("register")}
          >
            ลืมพาสเวิร์ด
          </Link>
        </div>

        <p className="text-center text-small">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            size="sm"
            color="secondary"
            style={{ cursor: "pointer" }}
            onPress={() => setSelected("register")}
          >
            เข้าสู่ระบบเลย
          </Link>
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="secondary"
            style={{ height: "2.75rem", fontSize: "1rem" }}
          >
            สมัครบัญชี
          </Button>
        </div>
      </form>
    </>
  );
}

function LoginForm({ setSelected }: AuthForm) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <h1>เข้าสู่ระบบด้วยบัญชี</h1>

      <form className="flex flex-col gap-5">
        <div>
          <Input
            isRequired
            label="อีเมล"
            placeholder="Enter your email"
            labelPlacement="outside"
            variant="bordered"
            type="email"
          />
        </div>
        <div style={{ position: "relative" }}>
          <Input
            isRequired
            label="พาสเวิร์ด"
            placeholder="Enter your password"
            labelPlacement="outside"
            variant="bordered"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
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
            onPress={() => setSelected("register")}
          >
            ลืมพาสเวิร์ด
          </Link>
        </div>
        <p className="text-center text-small">
          ยังไม่มีบัญชี?{" "}
          <Link
            size="sm"
            color="secondary"
            onPress={() => setSelected("login")}
          >
            สมัครเลย
          </Link>
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="secondary"
            style={{ height: "2.75rem", fontSize: "1rem" }}
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </form>
    </>
  );
}
