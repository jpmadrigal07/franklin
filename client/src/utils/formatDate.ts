import moment from "moment";

export const dateSlash = (date: string) => {
  return moment(date).format("MM/DD/YYYY");
};

export const dateSlashWithTime = (date: string) => {
  return moment(date).format("MM/DD/YYYY h:mm A");
};
