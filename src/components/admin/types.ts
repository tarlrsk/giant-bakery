export interface IProductRow {
  category: string;
  product: string;
  status: string;
}

export interface ICakeRow {
  cakeUpload?:
    | string
    | {
        path: string;
        preview: string;
      }
    | null;
  isActive?: boolean;
  cakeName?: string;
  description?: string;
  cakeType?: string;
  price?: number;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  cream?: string[];
  topEdge?: string[];
  bottomEdge?: string[];
  decoration?: string[];
  surface?: string[];
}

export interface ISnackBoxRow {
  isActive?: boolean;
  snackBoxName: string;
  description?: string;
  price?: number;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
}

export interface IVariantRow {
  variantType: string;
  variantName: string;
  isActive: boolean;
  lastUpdated: string;
}
