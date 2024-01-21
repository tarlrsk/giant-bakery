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
  maxQty: number;
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

export interface ICartItem {
  name: string;
  type: string;
  itemId: string;
  quantity: number;
  imageUrl: string;
  pricePer: number;
  price: number;
  createdAt: string;
  description?: string;
  cakeId?: string;
  refreshmentId?: string;
  variants?: ICartCakeVariants[];
  refreshments?: ICartSnackBox[];
}
