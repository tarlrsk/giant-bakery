const baseUrl = process.env.NEXT_PUBLIC_URL as string;

const createUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const paths = () => {
  // Cart
  const getCart = (userId: string) => createUrl(`carts?userId=${userId}`);
  const deleteCartItem = (userId: string, itemId: string) =>
    createUrl(`carts?userId=${userId}&itemId=${itemId}`);
  const updateCartItem = createUrl("carts");

  // Bakery
  const getBakeryByCat = (category: string) =>
    createUrl(`bakery?category=${category}`);

  return { getCart, updateCartItem, deleteCartItem, getBakeryByCat };
};

export default paths;
