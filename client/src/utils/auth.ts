import apiCall from "./apiCall";

// includes
const BASE = "/api/auth";
const POST_HEADERS = {
  "Content-Type": "application/json",
};

// calls
export const login = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const verify = (body: any = null) =>
  apiCall(`${BASE}/verify`, POST_HEADERS, "POST", body);
