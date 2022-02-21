import apiCall from "./apiCall";

// includes
const BASE = "/api/users";
const POST_HEADERS = {
  "Content-Type": "application/json",
};

// calls
export const verifyPassword = (body: any = null) =>
  apiCall(`${BASE}/verify-password`, POST_HEADERS, "POST", body);
