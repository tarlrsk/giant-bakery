const baseUrl = process.env.NEXT_PUBLIC_URL as string;

const createBaseApiUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const createAdminUrl = (endpoint: string) =>
  `${baseUrl}/api/portal/${endpoint}`;

const createClientUrl = (endpoint: string) =>
  `${baseUrl}/api/client/${endpoint}`;

const apiPaths = () => {
  // Auth
  const signUp = createBaseApiUrl("auth/signup");

  // Cart
  const getCart = (userId: string) => createClientUrl(`carts?userId=${userId}`);
  const deleteCartItem = (userId: string, itemId: string) =>
    createClientUrl(`carts?userId=${userId}&itemId=${itemId}`);
  const updateCartItem = createClientUrl("carts");

  // Bakery
  const getBakeryByCat = (category: string) =>
    createClientUrl(`bakery?category=${category}`);

  const getBakeries = () => createClientUrl(`bakery?category=`);

  // Beverage
  const getBeverages = () => createClientUrl(`beverages`);

  // Cake
  const getCakes = () => createClientUrl(`cakes`);

  // Cake
  const getCakesByType = (type: string) =>
    createClientUrl(`cakes?type=${type}`);

  // Customer Address
  const getCustomerAddress = (userId: string) =>
    createClientUrl(`customers/${userId}/addresses`);

  const createCustomerAddress = (userId: string) =>
    createClientUrl(`customers/${userId}/addresses`);

  const updateCustomerAddress = (userId: string) =>
    createClientUrl(`customers/${userId}/addresses`);

  const deleteCustomerAddress = (userId: string) =>
    createClientUrl(`customers/${userId}/addresses`);

  // Snack Box
  const addSnackBoxToCart = () => createClientUrl(`carts/snack-box`);
  // InterExpress
  const getInterExpressLocation = (zipCode: string) =>
    `https://api-intership.interexpress.co.th/v1/operation-areas/post-code/${zipCode}`;

  return {
    signUp,
    getCart,
    updateCartItem,
    deleteCartItem,
    getBakeryByCat,
    getCakes,
    getBakeries,
    getBeverages,
    getCakesByType,
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    getInterExpressLocation,
    addSnackBoxToCart,
  };
};

export default apiPaths;
