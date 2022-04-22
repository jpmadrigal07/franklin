import apiCall from "./apiCall";

// includes
const BASE = "/api/inventory";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllInventory = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addInventory = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateInventory = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const bulkUpdateInventory = (body: any = null) =>
  apiCall(`${BASE}/bulk/dashboard`, POST_HEADERS, "PATCH", body);
export const deleteInventory = (id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "DELETE");
