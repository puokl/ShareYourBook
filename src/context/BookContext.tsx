import { ReactNode, createContext, useContext, useState } from "react";

interface AuthorNameProps {
  alternate_names?: string | string[];
  birth_date?: string;
  death_date?: string;
  key?: string;
  name?: string;
  top_subjects?: string | string[];
  top_work?: string;
  type?: string;
  work_count?: number;
  _version_?: number;
}

interface BookContextProps {
  authorName: AuthorNameProps | AuthorNameProps[];
  setAuthorName: React.Dispatch<React.SetStateAction<string>>;
  bookName: string;
  setBookName: React.Dispatch<React.SetStateAction<string>>;
  selectedAuthor: AuthorNameProps;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<object>>;
}

interface BookContextProviderProps {
  children: ReactNode;
}
export const BookContext = createContext({} as BookContextProps);

export const BookContextProvider = ({ children }: BookContextProviderProps) => {
  const [authorName, setAuthorName] = useState({});
  const [bookName, setBookName] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorNameProps>({});

  return (
    <BookContext.Provider
      value={{
        authorName,
        setAuthorName,
        bookName,
        setBookName,
        selectedAuthor,
        setSelectedAuthor,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
