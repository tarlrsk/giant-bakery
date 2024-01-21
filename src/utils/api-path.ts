const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const createUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const paths = () => {
  // Cart
  const getCart = (userId: string) => createUrl(`carts?userId=${userId}`);
  const deleteCartItem = (userId: string, itemId: string) =>
    createUrl(`carts?userId=${userId}&itemId=${itemId}`);
  const updateCartItem = createUrl("carts");

  return { getCart, updateCartItem, deleteCartItem };
};

export default paths;
