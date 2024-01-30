import axios from "axios";

// ----------------------------------------------------------------------

const baseURL = process.env.NEXT_PUBLIC_URL as string;

const token = "testToken";

axios.defaults.baseURL = baseURL;

axios.defaults.headers.common = { Authorization: token };

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default axios;
