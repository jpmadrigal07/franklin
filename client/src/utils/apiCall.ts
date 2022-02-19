import axios, { Method } from "axios";

const apiCall = async (
  endpoint = "",
  headers = {},
  method: Method = "GET",
  body = null
) => {
  try {
    let res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: headers,
    });
    return res.data;
  } catch (err: any) {
    throw err.response ? err?.response?.data : err.message;
  }
};

export default apiCall;
