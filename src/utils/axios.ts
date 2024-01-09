import axios from "axios";

// ----------------------------------------------------------------------

const baseURL = "/api";

const token = "testToken";

axios.defaults.baseURL = baseURL;

axios.defaults.headers.common = { Authorization: `bearer ${token}` };

export default axios;
