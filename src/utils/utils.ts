import moment from "moment";

export const formattedDate = (item: string) => {
  return moment(item).fromNow();
};

type DateType = {
  nanoseconds: number;
  seconds: number;
};
export const formatFirebaseDate = (date: DateType) => {
  const milliseconds = date?.seconds * 1000 + date?.nanoseconds / 1000000;
  return moment(milliseconds).fromNow();
};

export const capitalizeWords = (item: string) => {
  return item
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const checkUndefinedURL = (url: string) => {
  const regex = /,/;
  if (
    regex.test(url) ||
    url === "https://covers.openlibrary.org/b/id/undefined-M.jpg"
  ) {
    return undefined;
  } else {
    return url;
  }
};
