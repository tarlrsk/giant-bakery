"use client";
import { z } from "zod";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/actions/userActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper, Stack, Typography } from "@mui/material";
import FormProvider from "@/components/hook-form/form-provider";
import RHFTextField from "@/components/hook-form/rhf-textfield";
import { signInValidationSchema } from "@/lib/validationSchema";

// ----------------------------------------------------------------------

type SignInProps = z.infer<typeof signInValidationSchema>;

// ----------------------------------------------------------------------

export default function AdminLogin() {
  const { onSignIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const methods = useForm<SignInProps>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: { email: "", password: "" },
  });

  const { watch, handleSubmit } = methods;

  const values = watch();

  const { email, password } = values;

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    try {
      await onSignIn(
        "credentials",
        setIsLoading,
        () => {
          toast.success("เข้าสู่ระบบสำเร็จ!");
          router.push("/admin/orders");
        },
        () => {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        },
        data,
      );
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  useEffect(() => {
    async function redirectUser() {
      const user = await getCurrentUser();

      if (!user) return;

      const { role } = user;
      if (role === "ADMIN") {
        router.push("/admin");
      }
    }

    redirectUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        sx={{
          pt: 2,
          pb: 4,
          px: 6,
          width: "25%",
          textAlign: "center",
        }}
      >
        <Box component="img" src="/logo.png" sx={{ width: 0.5, mb: 2 }} />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack direction="column" spacing={2}>
            <RHFTextField name="email" type="email" label="อีเมล" />
            <RHFTextField name="password" type="password" label="พาสเวิร์ด" />
          </Stack>

          {error && (
            <Box sx={{ mt: 1, textAlign: "left", height: 1 }}>
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            </Box>
          )}

          <LoadingButton
            fullWidth
            size="large"
            loading={isLoading}
            type="submit"
            color="primary"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!email || !password}
          >
            เข้าสู่ระบบ
          </LoadingButton>
        </FormProvider>
      </Paper>
    </Box>
  );
}
