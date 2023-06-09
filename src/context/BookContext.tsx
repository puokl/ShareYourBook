import { BookType } from "@/types/bookType";
import { database } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ReactNode, createContext, useEffect, useState } from "react";

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
  selectedAuthor: AuthorNameProps;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<object>>;
  bookCollection: BookType[];
  setBookCollection: React.Dispatch<React.SetStateAction<BookType[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BookContextProviderProps {
  children: ReactNode;
}

export const BookContext = createContext({} as BookContextProps);

export const BookContextProvider = ({ children }: BookContextProviderProps) => {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorNameProps>({});
  const [bookCollection, setBookCollection] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const booksCollectionRef = collection(database, "books");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const res = await getDocs(
          query(booksCollectionRef, orderBy("date", "desc"))
        );
        const data: BookType[] = res.docs.map((doc) => ({
          id: doc.id,
          bookName: doc.data().bookName,
          authorName: doc.data().authorName,
          email: doc.data().email,
          username: doc.data().authorName,
          date: doc.data().date,
          cover: doc.data().cover,
          comment: doc.data().comment,
          like: doc.data().like,
        }));
        setBookCollection(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error BookContext useEffect: ", error);
        setIsLoading(false);
      }
    };

    const unsubscribe = onSnapshot(booksCollectionRef, (snapshot) => {
      fetchBookData();
    });

    return unsubscribe;
  }, []);

  return (
    <BookContext.Provider
      value={{
        selectedAuthor,
        setSelectedAuthor,
        bookCollection,
        setBookCollection,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
