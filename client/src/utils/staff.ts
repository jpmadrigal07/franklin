import apiCall from "./apiCall";

// includes
const BASE = "/api/staffs";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllStaff = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addStaff = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateStaff = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
export const deleteStaff = (id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "DELETE");
