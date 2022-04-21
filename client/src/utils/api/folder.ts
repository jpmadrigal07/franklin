import apiCall from "../apiCall";

// includes
const BASE = "/api/folder";
const POST_HEADERS = {
  "Content-Type": "application/json",
};
const addCondition = (conditions: string) => {
  return conditions !== "" ? `?condition=${conditions}` : "";
};

// calls
export const getAllFolder = (conditions: string = "") =>
  apiCall(`${BASE}${addCondition(conditions)}`);
export const addFolder = (body: any = null) =>
  apiCall(`${BASE}`, POST_HEADERS, "POST", body);
export const updateFolder = (body: any = null, id: string = "") =>
  apiCall(`${BASE}/${id}`, POST_HEADERS, "PATCH", body);
