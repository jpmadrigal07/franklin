import apiCall from "../apiCall";

// includes
const BASE = "/api/orderDry";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrderDry = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrderDry = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateOrderDry = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const bulkUpdateDry = (body: any = null) =>
  apiCall(`${BASE}/bulk/dashboard`, POST_HEADERS, "PATCH", body);
