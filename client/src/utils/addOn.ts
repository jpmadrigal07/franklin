import apiCall from "./apiCall";

// includes
const BASE = "/api/addOn";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllAddOn = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addAddOn = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateAddOn = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const deleteAddOn = (id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "DELETE");
