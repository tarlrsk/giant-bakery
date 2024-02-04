import useSWR from "swr";
import { fetcher } from "@/utils/axios";
// import useSWRMutation from "swr/mutation";

// ----------------------------------------------------------------------

export default function useCart(userId: string) {
  const {
    data: cartItemsData,
    error: cartItemsError,
    isLoading: cartItemsIsLoading,
  } = useSWR(`/carts?userId=${userId}`, fetcher);

  return {
    cartItemsData,
    cartItemsError,
    cartItemsIsLoading,
  };
}
