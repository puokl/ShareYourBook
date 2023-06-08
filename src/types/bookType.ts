export type SignleCommentType = {
  date: string;
  text: string;
  username: string;
  email: string;
};

export type BookType = {
  id?: string;
  bookName: string;
  authorName: string;
  email: string;
  username: string;
  date: string;
  cover: string;
  comment: SignleCommentType[];
  like: string[];
};

// type of book from api
export type AuthorBookType = {
  authors: object[];
  covers: number[];
  created: object;
  key: string;
  last_modified: object;
  latest_revision: number;
  revision: number;
  title: string;
  type: object;
};
