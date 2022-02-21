import axios, { Method } from "axios";

const apiCall = async (
  endpoint = "",
  headers = {},
  method: Method = "GET",
  body = null
) => {
  const params = {
    method: method,
    url: endpoint,
    headers: headers,
  };
  try {
    let res = await axios(
      method === "DELETE" ? params : { ...params, data: body }
    );
    return res.data;
  } catch (err: any) {
    throw err.response ? err?.response?.data : err.message;
  }
};

export default apiCall;
