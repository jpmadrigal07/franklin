import apiCall from "./apiCall";

// includes
const BASE = "/api/order";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllOrder = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addOrder = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateOrder = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const deleteOrder = (id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "DELETE");
