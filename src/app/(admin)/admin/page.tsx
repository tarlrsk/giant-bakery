"use client";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import RHFTextField from "@/components/hook-form/rhf-textfield";
import { Box, Paper, Stack, Button, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function AdminHome() {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast("Update success!");
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ py: 4, px: 6, width: "25%" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sign In
        </Typography>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
            <RHFTextField name="email" label="อีเมล" />
            <RHFTextField name="password" label="พาสเวิร์ด" />
          </Stack>

          <Button fullWidth type="submit" color="primary" variant="contained">
            เข้าสู่ระบบ
          </Button>
        </FormProvider>
      </Paper>
    </Box>
  );
}
