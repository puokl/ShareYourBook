import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { database } from "@/firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Layout from "@/components/Layout";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { BookLibraryType } from "@/types/libraryType";
import { User as FirebaseUser } from "firebase/auth";
import { CloseIcon } from "@chakra-ui/icons";
import Router from "next/router";

const index: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [userBooks, setUserBooks] = useState([{}]);
  const [libraryCollection, setLibraryCollection] = useState<BookLibraryType[]>(
    []
  );
  const [bookIsLoading, setBookIsLoading] = useState(true);

  const booksCollectionRef = collection(database, "books");

  //SECTION -

  const getUserBooks = async (user: FirebaseUser) => {
    try {
      const usersCollectionRef = collection(database, "user");
      const userQuerySnapshot = await getDocs(
        query(usersCollectionRef, where("email", "==", user.email))
      );

      if (userQuerySnapshot.empty) {
        console.log(`No user found with email: ${user.email}`);
        return [];
      }

      // console.log("userQuerySnapshot", userQuerySnapshot);
      const userData = userQuerySnapshot.docs[0].data();
      // console.log("userData", userData);
      const publishedBooks = userData.publishedBooks || [];
      const books = [];

      for (const bookId of publishedBooks) {
        const bookDocSnapshot = await getDoc(doc(booksCollectionRef, bookId));

        if (bookDocSnapshot.exists()) {
          const bookData = bookDocSnapshot.data();
          books.push({ id: bookDocSnapshot.id, ...bookData });
        }
      }
      console.log("books", books);
      setUserBooks(books);

      return books;
    } catch (error) {
      console.error("Error retrieving user books: ", error);
      return [];
    }
  };

  //SECTION -
  const deleteBook = (bookID) => {
    console.log("userBooks", userBooks);
    const deleteBookRef = doc(database, "books", bookID);
    console.log("clicked");
    return deleteDoc(deleteBookRef)
      .then(() => {
        console.log("doc deleted");
        Router.reload();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  //SECTION -

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const docRef = doc(collection(database, "library"), user?.email);
        const docSnap = await getDoc(docRef);
        console.log("user.displayName", user?.email);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLibraryCollection(data.libri);
          console.log("libraryCollection", libraryCollection);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };
    getUserBooks(user);
    fetchLibrary();
    setBookIsLoading(false);
  }, [user]);

  return (
    <>
      <Layout>
        <Box minH="75vh">
          {bookIsLoading ? (
            <Flex alignItems="center" justifyContent="center" height="50vh">
              <Spinner />
            </Flex>
          ) : (
            <Box p={5}>
              <Text fontSize="xl" as="b" color="blue.700">
                My Bookshelf
              </Text>

              {libraryCollection &&
                libraryCollection.map((book, index) => (
                  <Flex key={index} m={4}>
                    <Image
                      boxSize="120px"
                      objectFit="contain"
                      fallbackSrc="/images/nocover.png"
                      src={book.cover}
                      alt={book.bookName}
                    />
                    <Flex direction="column" spacing={4} ml={10}>
                      <Text>Book Name: {book.bookName}</Text>
                      <Text>Author: {book.authorName}</Text>
                    </Flex>
                  </Flex>
                ))}
              {libraryCollection.length === 0 && (
                <Text>
                  Your bookshelf seems empty. Add a book to your collection!
                </Text>
              )}
              <Box mt={10}>
                <Divider borderColor="blue.700" mb={6} />
                <Text fontSize="xl" as="b" color="blue.700">
                  My published books
                </Text>

                {!bookIsLoading &&
                  userBooks &&
                  userBooks.map((book, index) => (
                    <Flex key={index} m={4}>
                      <Image
                        boxSize="120px"
                        objectFit="contain"
                        fallbackSrc="/images/nocover.png"
                        src={book.cover}
                        alt={book.bookName}
                      />
                      <Flex direction="column" spacing={4} ml={10}>
                        <Text>Title: {book.bookName}</Text>
                        <Text>Author: {book.authorName}</Text>
                        <Text
                          as="b"
                          onClick={() => deleteBook(book.id)}
                          sx={{ cursor: "pointer" }}
                          mt={5}
                          color="blue.500"
                        >
                          Delete
                        </Text>
                      </Flex>

                      {/* <CloseIcon
                        ml={300}
                        onClick={() => deleteBook(book.id)}
                        sx={{ cursor: "pointer" }}
                      /> */}
                    </Flex>
                  ))}

                {userBooks.length === 0 && (
                  <Text>
                    You habve no published books. Publish a book and share it to
                    the community!
                  </Text>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Layout>
    </>
  );
};
export default index;
