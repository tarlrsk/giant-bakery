import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useDropzone } from "react-dropzone";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { UploadProps } from "./types";
import Iconify from "../icons/Iconify";
import SingleFilePreview from "./preview-single-file";
import UploadIllustration from "./upload-illustration";

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      multiple: false,
      disabled,
      ...other,
    });

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      <UploadIllustration sx={{ width: 1, maxWidth: 160 }} />
      <Stack spacing={1} sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          วางไฟล์หรือคลิ๊กเพื่อ
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            เลือก
          </Box>
          จากอุปกรณ์หรือ คอมพิวเตอร์ของคุณ
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={typeof file === "string" ? file : file?.preview}
    />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: "absolute",
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" size={18} />
    </IconButton>
  );

  return (
    <Box sx={{ width: 1, position: "relative", ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: "none",
          borderRadius: 1,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) =>
            `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) =>
            theme.transitions.create(["opacity", "padding"]),
          "&:hover": {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...(hasError && {
            color: "error.main",
            borderColor: "error.main",
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: "32% 0",
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && helperText}
    </Box>
  );
}

// ----------------------------------------------------------------------
