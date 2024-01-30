const baseUrl = process.env.NEXT_PUBLIC_URL as string;

const createUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const paths = () => {
  // Cart
  const getCart = (userId: string) => createUrl(`carts?userId=${userId}`);
  const deleteCartItem = (userId: string, itemId: string) =>
    createUrl(`carts?userId=${userId}&itemId=${itemId}`);
  const updateCartItem = createUrl("carts");

  const getCustomerAddress = (userId: string) =>
    createUrl(`customers/${userId}/addresses`);

  return { getCart, updateCartItem, deleteCartItem, getCustomerAddress };
};

export default paths;
