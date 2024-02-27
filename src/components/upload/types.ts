import { BoxProps } from "@mui/material";
import { DropzoneOptions } from "react-dropzone";
import { Theme, SxProps } from "@mui/material/styles";
import { LazyLoadImageProps } from "react-lazy-load-image-component";

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  file?: CustomFile | string | null;
  layerFile?: CustomFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (File | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
}

// ----------------------------------------------------------------------

export type ImageRatio =
  | "4/3"
  | "3/4"
  | "6/4"
  | "4/6"
  | "16/9"
  | "9/16"
  | "21/9"
  | "9/21"
  | "1/1";

export type ImageProps = BoxProps &
  LazyLoadImageProps & {
    overlay?: string;
    ratio?: ImageRatio;
    disabledEffect?: boolean;
  };
