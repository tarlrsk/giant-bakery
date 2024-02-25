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

async function createItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "POST",
    body: arg,
  }).then((res) => {
    if (!res.ok) throw new Error("Something went wrong");
    return res;
  });
}

async function updateItem(url: string, { arg }: { arg: any }) {
  await fetch(url, {
    method: "PUT",
    body: arg,
  }).then((res) => {
    if (!res.ok) throw new Error("Something went wrong");
    return res;
  });
}

async function deleteItem(url: string, { arg }: { arg: any }) {
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
  selectedItem?:
    | IProductRow
    | ICakeRow
    | ISnackBoxRow
    | IVariant
    | RefreshmentProps,
) {
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

  const { trigger: deleteProductTrigger, isMutating: deleteProductIsLoading } =
    useSWRMutation(deleteProduct(selectedItem?.id || ""), deleteItem);

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

    deleteProductTrigger,
    deleteProductIsLoading,
  };
}
