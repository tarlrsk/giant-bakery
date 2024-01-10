"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

type ProvidersProps = {
  children: React.ReactNode;
};

const AuthProviders = ({ children }: ProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProviders;
