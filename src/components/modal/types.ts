export type IVariant = {
  id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type ICustomCake = {
  id: string;
  name: string;
  remark: string | null;
  quantity: number;
  imageFileName: string;
  imagePath: string;
  image: string;
  type: "PRESET" | "CUSTOM" | string;
  price: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  sizes: IVariant[];
  bases: IVariant[];
  fillings: IVariant[];
  creams: IVariant[];
  topEdges: IVariant[];
  bottomEdges: IVariant[];
  decorations: IVariant[];
  surfaces: IVariant[];
};
