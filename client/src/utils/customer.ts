import apiCall from "./apiCall";

// includes
const BASE = "/api/customers";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllCustomer = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addCustomer = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateCustomer = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
