import apiCall from "../apiCall";

// includes
const BASE = "/api/orderItem";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrderItem = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrderItem = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateOrderItem = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
