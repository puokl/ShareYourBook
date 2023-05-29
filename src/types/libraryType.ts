export type BookLibraryType = {
  authorName: string;
  bookName: string;
  cover: string;
  date: string;
  username: string;
};

export type LibraryType = {
  initialized: string;
  libri: BookLibraryType[];
};
