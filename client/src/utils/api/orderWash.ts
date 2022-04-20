import apiCall from "../apiCall";

// includes
const BASE = "/api/orderWash";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrderWash = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrderWash = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateOrderWash = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const bulkUpdateWash = (body: any = null) =>
  apiCall(`${BASE}/bulk/dashboard`, POST_HEADERS, "PATCH", body);
