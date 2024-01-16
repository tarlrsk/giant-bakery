const baseUrl = "http://localhost:3000";

const createUrl = (endpoint: string) => `${baseUrl}/api/${endpoint}`;

export const getCart = (userId: string) => createUrl(`carts?userId=${userId}`);
export const getSomething = createUrl("");
