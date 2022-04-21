import apiCall from "../apiCall";

// includes
const BASE = "/api/orderDiscount";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrderDiscount = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrderDiscount = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const bulkAddOrderDiscounts = (body: any = null) =>
  apiCall(`${BASE}/bulk`, POST_HEADERS, "POST", body);
export const updateOrderDiscount = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
