import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { database } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  get,
} from "firebase/firestore";
import Layout from "@/components/Layout";
import { firestore } from "firebase-admin";
type indexProps = {};

const index: React.FC<indexProps> = () => {
  const { user } = useContext(AuthContext);
  const [libraryData, setLibraryData] = useState({});
  // const libraryCollectionRef = collection(database, "library");
  const [books, setBooks] = useState([]);

  // const getLibrary = async () => {

  // };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const docRef = doc(collection(database, "library"), user?.displayName);
        const docSnap = await getDoc(docRef);
        console.log("user.displayName", user.displayName);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBooks(data.libri);
          console.log("books", books);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <>
      <Layout>
        <div>
          <h2>Book List</h2>
          {console.log("books", books)}
          <ul>
            {books.map((book, index) => (
              <li key={index}>
                <img src={book.cover} alt={book.bookName} />
                <p>Book Name: {book.bookName}</p>
                <p>Author: {book.authorName}</p>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </>
  );
};
export default index;
