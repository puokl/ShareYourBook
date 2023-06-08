import { BookType } from "@/types/bookType";
import { database } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
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
  // authorName: AuthorNameProps | AuthorNameProps[];
  // setAuthorName: React.Dispatch<React.SetStateAction<string>>;
  // bookName: string;
  // setBookName: React.Dispatch<React.SetStateAction<string>>;
  selectedAuthor: AuthorNameProps;
  setSelectedAuthor: React.Dispatch<React.SetStateAction<object>>;
  bookCollection: BookType;
  setBookCollection: React.Dispatch<React.SetStateAction<object>>;
  isLoading: boolean;
}

interface BookContextProviderProps {
  children: ReactNode;
}

export const BookContext = createContext({} as BookContextProps);

export const BookContextProvider = ({ children }: BookContextProviderProps) => {
  // const [authorName, setAuthorName] = useState({});
  // const [bookName, setBookName] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorNameProps>({});

  const [bookCollection, setBookCollection] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const booksCollectionRef = collection(database, "books");

  const deleteBook = () => {
    const deleteBookRef = doc(database, "books", book.id);
    console.log("clicked");
    return deleteDoc(deleteBookRef)
      .then(() => {
        console.log("doc deleted");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const res = await getDocs(
          query(booksCollectionRef, orderBy("date", "desc"))
        );
        console.log("res.docs", res.docs);
        const data: BookType[] = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("docData:", data);
        setBookCollection(data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
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
        // authorName,
        // setAuthorName,
        // bookName,
        // setBookName,
        selectedAuthor,
        setSelectedAuthor,
        bookCollection,
        setBookCollection,
        isLoading,
        setIsLoading,
        // deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
