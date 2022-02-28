import apiCall from "./apiCall";

// includes
const BASE = "/api/wash";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllWash = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addWash = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateWash = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const deleteWash = (id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "DELETE");
