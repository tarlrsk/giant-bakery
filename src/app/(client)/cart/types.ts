export interface ICartCakeVariants {
  id: string;
  name: string;
  imageFileName: string;
  image: string;
  type: string;
  isActive: boolean;
  isVisualized: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  cakeIds: number[];
  customCakeIds: number[];
}

export interface ICartSnackBox {
  id: string;
  name: string;
  description: string;
  imageFileName: string;
  image: string;
  category: string;
  status: string;
  minQty: number;
  currQty: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  snackBoxId: string | null;
}

interface ICartCakeVariant {
  id: string;
  name: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  color?: string;
}

export interface ICartItem {
  name: string;
  type: string;
  itemId: string;
  itemType: string;
  quantity: number;
  image: string;
  pricePer: number;
  price: number;
  createdAt: string;
  packageType?: "PAPER_BAG" | "SNACK_BOX_S" | "SNACK_BOX_M";
  description?: string;
  cakeId?: string;
  refreshmentId?: string;
  refreshments?: ICartSnackBox[];

  size: ICartCakeVariant;
  base: ICartCakeVariant;
  filling: ICartCakeVariant;
  cream: ICartCakeVariant;
  topEdge: ICartCakeVariant;
  decoration: ICartCakeVariant;
  bottomEdge: ICartCakeVariant;
  surface: ICartCakeVariant;
}
