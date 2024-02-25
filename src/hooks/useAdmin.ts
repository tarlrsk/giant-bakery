import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import useSWRMutation from "swr/mutation";
import { adminFetcher } from "@/utils/axios";
import {
  ICakeRow,
  IVariant,
  IProductRow,
  ISnackBoxRow,
} from "@/components/admin/types";

// ----------------------------------------------------------------------

async function createItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "POST",
    body: arg,
  });
}

async function updateItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "PUT",
    body: arg,
  });
}

// ----------------------------------------------------------------------

export default function useAdmin(
  selectedItem?: IProductRow | ICakeRow | ISnackBoxRow | IVariant,
) {
  const {
    getProducts,
    createProduct,
    updateProduct,
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
  } = apiPaths();

  // Products
  const {
    data: productsData,
    mutate: productsMutate,
    isLoading: productsIsLoading,
  } = useSWR(getProducts(), adminFetcher);

  const { trigger: updateProductTrigger, isMutating: updateProductIsLoading } =
    useSWRMutation(updateProduct(selectedItem?.id || ""), updateItem);

  const { trigger: createProductTrigger, isMutating: createProductIsLoading } =
    useSWRMutation(createProduct(), createItem);

  // Cakes
  const {
    data: cakesData,
    mutate: cakesMutate,
    isLoading: cakesIsLoading,
  } = useSWR(getCakesAdmin(), adminFetcher);

  const { trigger: updateCakeTrigger, isMutating: updateCakeIsLoading } =
    useSWRMutation(updateCakeAdmin(selectedItem?.id || ""), updateItem);

  const { trigger: createCakeTrigger, isMutating: createCakeIsLoading } =
    useSWRMutation(createCakeAdmin(), createItem);

  // Snack box
  const {
    data: snackBoxData,
    mutate: snackBoxMutate,
    isLoading: snackBoxIsLoading,
  } = useSWR(getSnackBoxAdmin(), adminFetcher);

  const {
    trigger: updateSnackBoxTrigger,
    isMutating: updateSnackBoxIsLoading,
  } = useSWRMutation(updateSnackBoxAdmin(selectedItem?.id || ""), updateItem);

  const {
    trigger: createSnackBoxTrigger,
    isMutating: createSnackBoxIsLoading,
  } = useSWRMutation(createSnackBoxAdmin(), createItem);

  // Variants
  const {
    data: variantsData,
    mutate: variantsMutate,
    isLoading: variantsIsLoading,
  } = useSWR(getVariantAdmin(), adminFetcher);

  const { data: creamBaseData } = useSWR(
    `${getVariantAdmin()}/CREAM/a2e06756-2a32-4762-9b9d-6f669be3ac83`,
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
          : "CREAM",
        selectedItem?.id || "",
      ),
      updateItem,
    );

  const { trigger: createVariantTrigger, isMutating: createVariantIsLoading } =
    useSWRMutation(createVariantAdmin(), createItem);

  return {
    productsData,
    productsMutate,
    productsIsLoading,
    updateProductTrigger,
    updateProductIsLoading,
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
  };
}
