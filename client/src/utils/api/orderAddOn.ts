import apiCall from "../apiCall";

// includes
const BASE = "/api/orderAddOn";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrderAddOn = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrderAddOn = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateOrderAddOn = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
