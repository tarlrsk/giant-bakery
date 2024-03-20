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
    removeVariantColorImage,
  } = apiPaths();

  const useProductAdmin = () => {
    const {
      data: productsData,
      mutate: productsMutate,
      isLoading: productsIsLoading,
    } = useSWR(getProducts(), adminFetcher, options);

    const {
      trigger: createProductTrigger,
      isMutating: createProductIsLoading,
    } = useSWRMutation(createProduct(), createItem);

    return {
      productsData,
      productsMutate,
      productsIsLoading,
      createProductTrigger,
      createProductIsLoading,
    };
  };

  const useCakeAdmin = () => {
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

    return {
      cakesData,
      cakesMutate,
      cakesIsLoading,
      updateCakeTrigger,
      updateCakeIsLoading,
      createCakeTrigger,
      createCakeIsLoading,
      deleteCakeTrigger,
      deleteCakeIsLoading,
    };
  };

  const useSnackBoxAdmin = () => {
    const {
      data: snackBoxData,
      mutate: snackBoxMutate,
      isLoading: snackBoxIsLoading,
    } = useSWR(getSnackBoxAdmin(), adminFetcher, options);

    const {
      data: productsData,
      mutate: productsMutate,
      isLoading: productsIsLoading,
    } = useSWR(getProducts(), adminFetcher, options);

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

    return {
      snackBoxData,
      snackBoxMutate,
      snackBoxIsLoading,
      updateSnackBoxTrigger,
      updateSnackBoxIsLoading,
      createSnackBoxTrigger,
      createSnackBoxIsLoading,
      deleteSnackBoxTrigger,
      deleteSnackBoxIsLoading,
      productsData,
      productsMutate,
      productsIsLoading,
    };
  };

  const useVariantAdmin = (selectedItem?: IVariant) => {
    const {
      data: variantsData,
      mutate: variantsMutate,
      isLoading: variantsIsLoading,
    } = useSWR(getVariantAdmin(), adminFetcher, options);

    const {
      trigger: updateVariantTrigger,
      isMutating: updateVariantIsLoading,
    } = useSWRMutation(updateVariantAdmin(), updateItem);

    const {
      trigger: createVariantTrigger,
      isMutating: createVariantIsLoading,
    } = useSWRMutation(createVariantAdmin(), createItem);

    const {
      trigger: removeVariantColorImageTrigger,
      isMutating: removeVariantColorImageIsLoading,
    } = useSWRMutation(removeVariantColorImage(), updateItem);

    const {
      trigger: deleteVariantTrigger,
      isMutating: deleteVariantIsLoading,
    } = useSWRMutation(
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

    return {
      variantsData,
      variantsMutate,
      variantsIsLoading,
      removeVariantColorImageTrigger,
      removeVariantColorImageIsLoading,
      updateVariantTrigger,
      updateVariantIsLoading,
      createVariantTrigger,
      createVariantIsLoading,

      deleteVariantTrigger,
      deleteVariantIsLoading,
    };
  };

  const useOrderAdmin = () => {
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
      ordersData,
      ordersMutate,
      ordersIsLoading,
      orderByIdData,
      orderByIdMutate,
      orderByIdIsLoading,
    };
  };

  return {
    useProductAdmin,
    useCakeAdmin,
    useSnackBoxAdmin,
    useOrderAdmin,
    useVariantAdmin,
  };
}
