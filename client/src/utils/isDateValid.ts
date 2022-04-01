import moment from "moment";

export const isBirthDateValid = (date: string) => {
  return moment(date, "MM/DD/YYYY", true).isValid();
};
