export interface IProductRow extends ICommonRow {
  type: string;
  category: string;
  status: string;
  minQty: number;
  maxQty: number;
  currQty: number;
  snackBoxId?: string | null;
  unitTypeId?: string;
  unitType: string;
}

export interface ICakeRow extends ICommonRow {
  type: string;
  sizes: ICakeVariantRow[];
  bases: ICakeVariantRow[];
  fillings: ICakeVariantRow[];
  creams: ICakeVariantRow[];
  topEdges: ICakeVariantRow[];
  bottomEdges: ICakeVariantRow[];
  decorations: ICakeVariantRow[];
  surfaces: ICakeVariantRow[];
}

export interface ISnackBoxRow extends ICommonRow {
  type: string;
  packageType: string;
  beverage: string;
  refreshments: IRefreshmentRow[];
}

export interface IVariantRow {
  creams: IVariant[];
  topEdges: IVariant[];
  bottomEdges: IVariant[];
  decorations: IVariant[];
  surfaces: IVariant[];
}

// ----------------------------------------------------------------------

interface ICommonRow {
  id: string;
  name: string;
  description: string | null;
  remark?: string | null;
  quantity?: number;
  imageFileName: string | null;
  imagePath?: string | null;
  image: string;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | string;
  deletedAt: string | null;
  weight: number;
  height: number;
  length: number;
  width: number;
}

interface IRefreshmentRow {
  id: string;
  refreshmentId: string;
  snackBoxId: string;
  refreshment: IProductRow;
}

export interface IVariant {
  id: string;
  type: "CREAM" | "TOP_EDGE" | "BOTTOM_EDGE" | "DECORATION" | "SURFACE";
  name: string;
  imageFileName: string;
  imagePath: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface ICakeVariantRow {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}
