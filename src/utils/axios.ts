import axios from "axios";

// ----------------------------------------------------------------------

const baseURL = "http://localhost:3000/api";

const token = "testToken";

axios.defaults.baseURL = baseURL;

axios.defaults.headers.common = { Authorization: token };

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default axios;
