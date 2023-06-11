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
import { Box, Flex, Image, Text, Spinner, Divider } from "@chakra-ui/react";
import { BookLibraryType } from "@/types/libraryType";
import { User as FirebaseUser } from "firebase/auth";
import Router from "next/router";
import { BookType } from "@/types/bookType";

const index: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [userBooks, setUserBooks] = useState<BookType[]>([]);
  const [libraryCollection, setLibraryCollection] = useState<BookLibraryType[]>(
    []
  );
  const [bookIsLoading, setBookIsLoading] = useState(true);

  const booksCollectionRef = collection(database, "books");

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
      const userData = userQuerySnapshot.docs[0].data();
      const publishedBooks = userData.publishedBooks || [];
      const books = [];

      for (const bookId of publishedBooks) {
        const bookDocSnapshot = await getDoc(doc(booksCollectionRef, bookId));

        if (bookDocSnapshot.exists()) {
          const bookData = bookDocSnapshot.data();
          books.push({ id: bookDocSnapshot.id, ...bookData });
        }
      }
      setUserBooks(books as BookType[]);
      return books;
    } catch (error) {
      console.error("Error getUserBooks: ", error);
      return [];
    }
  };

  const deleteBook = (bookID: string) => {
    const deleteBookRef = doc(database, "books", bookID);
    return deleteDoc(deleteBookRef)
      .then(() => {
        console.log("doc deleted");
        Router.reload();
      })
      .catch((err) => {
        console.log("deleteBook error", err);
      });
  };

  //SECTION -

  useEffect(() => {
    const fetchLibrary = async () => {
      if (user?.email) {
        try {
          const docRef = doc(collection(database, "library"), user?.email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setLibraryCollection(data.libri);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log("Error library_username_index: ", error);
        }
      }
    };
    if (user) {
      getUserBooks(user);
      fetchLibrary();
      setBookIsLoading(false);
    }
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
                    <Flex direction="column" ml={10}>
                      <Text>
                        Title: <Text as="b">{book.bookName}</Text>
                      </Text>
                      <Text>
                        Author: <Text as="b">{book.authorName}</Text>
                      </Text>
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
                      <Flex direction="column" ml={10}>
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
