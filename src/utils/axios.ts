import axios from "axios";

// ----------------------------------------------------------------------

const baseUrl = `${process.env.NEXT_PUBLIC_URL as string}/api`;

axios.defaults.baseURL = baseUrl;

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default axios;
