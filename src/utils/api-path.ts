const baseUrl = process.env.NEXT_PUBLIC_URL as string;

const createUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const apiPaths = () => {
  // Cart
  const getCart = (userId: string) => createUrl(`carts?userId=${userId}`);
  const deleteCartItem = (userId: string, itemId: string) =>
    createUrl(`carts?userId=${userId}&itemId=${itemId}`);
  const updateCartItem = createUrl("carts");

  // Bakery
  const getBakeryByCat = (category: string) =>
    createUrl(`bakery?category=${category}`);

  const getCustomerAddress = (userId: string) =>
    createUrl(`customers/${userId}/addresses`);

  const createCustomerAddress = (userId: string) =>
    createUrl(`customers/${userId}/addresses`);

  const updateCustomerAddress = (userId: string) =>
    createUrl(`customers/${userId}/addresses`);

  const deleteCustomerAddress = (userId: string) =>
    createUrl(`customers/${userId}/addresses`);

  const getInterExpressLocation = (zipCode: string) =>
    `https://api-intership.interexpress.co.th/v1/operation-areas/post-code/${zipCode}`;

  return {
    getCart,
    updateCartItem,
    deleteCartItem,
    getBakeryByCat,
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    getInterExpressLocation,
  };
};

export default apiPaths;
