import { IBakeryCategory } from "@/components/BakeryItems";

export const baseUrl = process.env.NEXT_PUBLIC_URL as string;
const interExpressUrl = process.env.NEXT_PUBLIC_INTER_EXPRESS_API as string;

const createBaseApiUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

const createAdminUrl = (endpoint: string) =>
  `${baseUrl}/api/portal/${endpoint}`;

const createClientUrl = (endpoint: string) =>
  `${baseUrl}/api/client/${endpoint}`;

const createInterExpressUrl = (endpoint: string) =>
  `${interExpressUrl}/${endpoint}`;

// ----------------------------------------------------------------------

const apiPaths = () => {
  // Auth
  const signUp = () => createBaseApiUrl("auth/signup");

  // Cart
  const getCart = (userId: string) => createClientUrl(`carts?userId=${userId}`);

  const deleteCartItem = (userId: string, itemId: string) =>
    createClientUrl(`carts?userId=${userId}&itemId=${itemId}`);

  const updateCartItem = () => createClientUrl("carts");

  const addRefreshmentToCart = () => createClientUrl(`carts/refreshments`);

  const addPresetSnackBoxToCart = () =>
    createClientUrl(`carts/preset-snack-box`);

  const addCustomSnackBoxToCart = () =>
    createClientUrl(`carts/custom-snack-box`);

  const addCakeToCart = () => createClientUrl(`carts/cakes`);

  // Bakery
  const getBakeries = (category: IBakeryCategory, amount?: string) =>
    createClientUrl(`bakeries?category=${category}&amount=${amount}`);

  const getBakeryBySlug = (slug: string, id: string) =>
    createClientUrl(`bakeries/${slug}?id=${id}`);

  // Beverage
  const getBeverages = () => createClientUrl(`beverages`);

  const getBeverageBySlug = (slug: string, id: string) =>
    createClientUrl(`beverages/${slug}?id=${id}`);

  // Cake
  const getCakes = (type: string) => createClientUrl(`cakes?type=${type}`);

  const getCakeBySlug = (slug: string, id: string) =>
    createClientUrl(`cakes/${slug}?id=${id}`);

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
  const getPresetSnackBox = () => createClientUrl(`snack-boxes`);

  const getPresetSnackBoxBySlug = (slug: string, id: string) =>
    createClientUrl(`snack-boxes/${slug}?id=${id}`);

  // Checkout
  const addCheckoutOrder = () => createClientUrl("orders/checkout");

  // InterExpress
  const getInterExpressLocation = (zipCode: string) =>
    `https://api-intership.interexpress.co.th/v1/operation-areas/post-code/${zipCode}`;

  const getPrice = () =>
    `https://api-intership.interexpress.co.th/v1/price/check`;

  // ----------------------------------------------------------------------

  // Products
  const getProducts = () => createAdminUrl("refreshments");
  const createProduct = () => createAdminUrl("refreshments");
  const updateProduct = (id: string) => createAdminUrl(`refreshments/${id}`);
  const deleteProduct = (id: string) => createAdminUrl(`refreshments/${id}`);
  // Cake
  const getCakesAdmin = () => createAdminUrl("cakes");
  const createCakeAdmin = () => createAdminUrl("cakes");
  const updateCakeAdmin = (id: string) => createAdminUrl(`cakes/${id}`);
  const deleteCakeAdmin = (id: string) => createAdminUrl(`cakes/${id}`);
  // Snack box
  const getSnackBoxAdmin = () => createAdminUrl("preset-snack-boxes");
  const createSnackBoxAdmin = () => createAdminUrl("preset-snack-boxes");
  const updateSnackBoxAdmin = (id: string) =>
    createAdminUrl(`preset-snack-boxes/${id}`);
  const deleteSnackBoxAdmin = (id: string) =>
    createAdminUrl(`preset-snack-boxes/${id}`);
  // Variants
  const getVariantAdmin = () => createAdminUrl("variants");
  const createVariantAdmin = () => createAdminUrl("variants");
  const updateVariantAdmin = (
    type: "CREAM" | "TOP_EDGE" | "BOTTOM_EDGE" | "DECORATION" | "SURFACE",
    string: string,
  ) => createAdminUrl(`variants/${type}/${string}`);
  const deleteVariantAdmin = (
    type: "CREAM" | "TOP_EDGE" | "BOTTOM_EDGE" | "DECORATION" | "SURFACE",
    string: string,
  ) => createAdminUrl(`variants/${type}/${string}`);

  // Orders
  const getOrdersOverview = () => createAdminUrl("orders/overview");

  return {
    signUp,
    getCart,
    updateCartItem,
    deleteCartItem,
    addRefreshmentToCart,
    addPresetSnackBoxToCart,
    addCustomSnackBoxToCart,
    addCakeToCart,
    getBakeries,
    getBakeryBySlug,
    getBeverages,
    getBeverageBySlug,
    getCakes,
    getCakeBySlug,
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    addCheckoutOrder,
    getInterExpressLocation,
    getPresetSnackBox,
    getPresetSnackBoxBySlug,
    getPrice,

    // Admin
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
    getOrdersOverview,
  };
};

export default apiPaths;
