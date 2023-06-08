export type UserType = {
  email: string;
  photoURL: string;
  username: string;
  lastLoginDate?: string;
  firstLoginDate: string;
  publishedBooks: string[];
};

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
