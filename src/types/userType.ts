type DateType = {
  nanoseconds: number;
  seconds: number;
};

export type UserType = {
  email: string;
  photoURL: string;
  username: string;
  lastLoginDate?: DateType;
  firstLoginDate: DateType;
  publishedBooks?: string[];
};

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
