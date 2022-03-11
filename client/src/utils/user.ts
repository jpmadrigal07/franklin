import apiCall from "./apiCall";

// includes
const BASE = "/api/users";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllUser = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addUser = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateUser = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const changePassword = (body: any = null) =>
  apiCall(`${BASE}/change-password`, POST_HEADERS, "POST", body);
export const verifyPassword = (body: any = null) =>
  apiCall(`${BASE}/verify-password`, POST_HEADERS, "POST", body);
