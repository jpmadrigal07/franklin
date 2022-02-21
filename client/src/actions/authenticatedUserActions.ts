import { ADD_USER } from "./types";

export const setAuthenticatedUser = (user: any) => {
  return {
    type: ADD_USER,
    payload: user,
  };
};
