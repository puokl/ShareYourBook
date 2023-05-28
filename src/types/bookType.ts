export type SignleCommentType = {
  date: string;
  text: string;
  username: string;
};

export type BookType = {
  bookName: string;
  authorName: string;
  email: string;
  username: string;
  date: string;
  cover: string;
  comment: SignleCommentType[];
  like: string[];
};
