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
