import { ADD_USER } from "../actions/types";

const initialState = {
  user: {},
};
// eslint-disable-next-line
export default function (state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case ADD_USER:
      return {
        user: payload,
      };
    default:
      return state;
  }
}
