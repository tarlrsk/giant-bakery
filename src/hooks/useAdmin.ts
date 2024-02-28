import { z } from "zod";
import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import useSWRMutation from "swr/mutation";
import { adminFetcher } from "@/utils/axios";
import { refreshmentValidationSchema } from "@/lib/validationSchema";
import {
  ICakeRow,
  IVariant,
  IProductRow,
  ISnackBoxRow,
} from "@/components/admin/types";

// ----------------------------------------------------------------------

type RefreshmentProps = z.infer<typeof refreshmentValidationSchema>;

export async function createItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "POST",
    body: arg,
  }).then((res) => {
    if (!res.ok) throw new Error("Something went wrong");
    return res;
  });
}

export async function updateItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "PUT",
    body: arg,
  }).then((res) => {
    if (!res.ok) throw new Error("Something went wrong");
    return res;
  });
}

export async function deleteItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "DELETE",
    body: arg,
  }).then((res) => {
    if (!res.ok) throw new Error("Something went wrong");
    return res;
  });
}

// ----------------------------------------------------------------------

export default function useAdmin(
  selectedItem?: IProductRow | ICakeRow | ISnackBoxRow | IVariant,
) {
  const options = { revalidateOnFocus: false };

  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCakesAdmin,
    createCakeAdmin,
    updateCakeAdmin,
    deleteCakeAdmin,
    getSnackBoxAdmin,
    createSnackBoxAdmin,
    updateSnackBoxAdmin,
    deleteSnackBoxAdmin,
    getVariantAdmin,
    createVariantAdmin,
    updateVariantAdmin,
    deleteVariantAdmin,
    getOrders,
    getOrderById,
  } = apiPaths();

  // Products
  const {
    data: productsData,
    mutate: productsMutate,
    isLoading: productsIsLoading,
  } = useSWR(getProducts(), adminFetcher, options);

  // console.log(updateProduct(selectedItem?.id || ""));

  const { trigger: createProductTrigger, isMutating: createProductIsLoading } =
    useSWRMutation(createProduct(), createItem);

  // Cakes
  const {
    data: cakesData,
    mutate: cakesMutate,
    isLoading: cakesIsLoading,
  } = useSWR(getCakesAdmin(), adminFetcher, options);

  const { trigger: updateCakeTrigger, isMutating: updateCakeIsLoading } =
    useSWRMutation(updateCakeAdmin(selectedItem?.id || ""), updateItem);

  const { trigger: createCakeTrigger, isMutating: createCakeIsLoading } =
    useSWRMutation(createCakeAdmin(), createItem);

  const { trigger: deleteCakeTrigger, isMutating: deleteCakeIsLoading } =
    useSWRMutation(deleteCakeAdmin(selectedItem?.id || ""), deleteItem);

  // Snack box
  const {
    data: snackBoxData,
    mutate: snackBoxMutate,
    isLoading: snackBoxIsLoading,
  } = useSWR(getSnackBoxAdmin(), adminFetcher, options);

  const {
    trigger: updateSnackBoxTrigger,
    isMutating: updateSnackBoxIsLoading,
  } = useSWRMutation(updateSnackBoxAdmin(selectedItem?.id || ""), updateItem);

  const {
    trigger: createSnackBoxTrigger,
    isMutating: createSnackBoxIsLoading,
  } = useSWRMutation(createSnackBoxAdmin(), createItem);

  const {
    trigger: deleteSnackBoxTrigger,
    isMutating: deleteSnackBoxIsLoading,
  } = useSWRMutation(deleteSnackBoxAdmin(selectedItem?.id || ""), deleteItem);

  // Variants
  const {
    data: variantsData,
    mutate: variantsMutate,
    isLoading: variantsIsLoading,
  } = useSWR(getVariantAdmin(), adminFetcher, options);

  const { data: creamBaseData } = useSWR(
    `${getVariantAdmin()}/CREAM/30e2bb1c-3dd3-4293-8ef4-0b2b3454cbe9`,
    adminFetcher,
  );

  const { trigger: updateVariantTrigger, isMutating: updateVariantIsLoading } =
    useSWRMutation(
      updateVariantAdmin(
        selectedItem
          ? (selectedItem.type as
              | "CREAM"
              | "TOP_EDGE"
              | "BOTTOM_EDGE"
              | "DECORATION"
              | "SURFACE")
          : "TOP_EDGE",
        selectedItem?.id || "",
      ),
      updateItem,
    );

  const { trigger: createVariantTrigger, isMutating: createVariantIsLoading } =
    useSWRMutation(createVariantAdmin(), createItem);

  const { trigger: deleteVariantTrigger, isMutating: deleteVariantIsLoading } =
    useSWRMutation(
      deleteVariantAdmin(
        selectedItem?.type as
          | "CREAM"
          | "TOP_EDGE"
          | "BOTTOM_EDGE"
          | "DECORATION"
          | "SURFACE",
        selectedItem?.id || "",
      ),
      deleteItem,
    );

  // Orders
  const {
    data: ordersData,
    mutate: ordersMutate,
    isLoading: ordersIsLoading,
  } = useSWR(getOrders(), adminFetcher, options);

  const {
    data: orderByIdData,
    mutate: orderByIdMutate,
    isLoading: orderByIdIsLoading,
  } = useSWR(getOrderById(selectedItem?.id || ""), adminFetcher);

  return {
    productsData,
    productsMutate,
    productsIsLoading,

    createProductTrigger,
    createProductIsLoading,
    //
    cakesData,
    cakesMutate,
    cakesIsLoading,
    updateCakeTrigger,
    updateCakeIsLoading,
    createCakeTrigger,
    createCakeIsLoading,
    //
    snackBoxData,
    snackBoxMutate,
    snackBoxIsLoading,
    updateSnackBoxTrigger,
    updateSnackBoxIsLoading,
    createSnackBoxTrigger,
    createSnackBoxIsLoading,
    //
    variantsData,
    creamBaseData,
    variantsMutate,
    variantsIsLoading,
    updateVariantTrigger,
    updateVariantIsLoading,
    createVariantTrigger,
    createVariantIsLoading,

    deleteCakeTrigger,
    deleteCakeIsLoading,
    deleteVariantTrigger,
    deleteVariantIsLoading,
    deleteSnackBoxTrigger,
    deleteSnackBoxIsLoading,
    //
    ordersData,
    ordersMutate,
    ordersIsLoading,
    orderByIdData,
    orderByIdMutate,
    orderByIdIsLoading,
  };
}
