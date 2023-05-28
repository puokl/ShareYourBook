import moment from "moment";

export const formattedDate = (item: string) => {
  return moment(item).fromNow();
};
