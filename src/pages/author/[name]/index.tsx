import { AuthContext } from "@/context/AuthContext";
import { BookContext } from "@/context/BookContext";
import { database } from "@/firebase/firebaseConfig";
import {
  Button,
  Flex,
  Image,
  Text,
  VStack,
  useToast,
  Spacer,
  Box,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import "firebase/firestore";
import Layout from "@/components/Layout";
import { AuthorBookType } from "@/types/bookType";

const index: React.FC = () => {
  const { setSelectedAuthor, selectedAuthor } = useContext(BookContext);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [authorBook, setAuthorBook] = useState<AuthorBookType[]>([]);
  const { name, key } = selectedAuthor;
  const toast = useToast();

  const bookRef = collection(database, "books");

  const handleSubmitBook = (item: AuthorBookType) => {
    addDoc(bookRef, {
      bookName: item.title,
      date: new Date().toISOString(),
      username: user?.displayName,
      cover: `https://covers.openlibrary.org/b/id/${item.covers}-M.jpg`,
      authorName: selectedAuthor.name,
      like: [],
      email: user?.email,
    })
      // adding book id to user collection to manage user page
      .then((docRef) => {
        if (user?.email) {
          const bookdocRef = doc(database, "user", user.email);
          updateDoc(bookdocRef, { publishedBooks: arrayUnion(docRef.id) });
        }
      })
      .catch((err) => {
        alert(err.message);
        console.log("handleSubmitBook error", err.message);
      });
  };

  const libraryRef = collection(database, "library");

  const handleSubmitLibrary = (item: AuthorBookType) => {
    if (user?.email) {
      const libraryDocRef = doc(database, "library", user?.email);
      getDoc(libraryDocRef).then((res) => {
        if (res.exists()) {
          updateDoc(libraryDocRef, {
            libri: arrayUnion({
              bookName: item.title,
              date: new Date().toISOString(),
              username: user?.displayName,
              cover: `https://covers.openlibrary.org/b/id/${item.covers}-M.jpg`,
              authorName: selectedAuthor.name,
              email: user?.email,
            }),
          }).catch((err) => {
            alert(err.message);
            console.log("handleSubmitLibrary error", err.message);
          });
        } else {
          if (user?.email) {
            setDoc(doc(database, "library", user?.email), {
              initialized: true,
              libri: [
                {
                  bookName: item.title,
                  date: new Date().toISOString(),
                  username: user?.displayName,
                  cover: `https://covers.openlibrary.org/b/id/${item.covers}-M.jpg`,
                  authorName: selectedAuthor.name,
                  email: user?.email,
                },
              ],
            }).catch((err) => {
              alert(err.message);
              console.log("handleSubmitLibrary error", err.message);
            });
          }
        }
      });
    }
  };

  const handleItemClickLibrary = (item: AuthorBookType) => {
    return () => {
      try {
        handleSubmitLibrary(item);
        toast({
          position: "top",
          title: "Book saved!",
          description: "We've added the book to your booklist",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          position: "top",
          title: "Failed",
          description: `There was an error in adding your book,${error}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
  };

  const handleItemClickBook = (item: AuthorBookType) => {
    return () => {
      try {
        handleSubmitBook(item);
        toast({
          position: "top",
          title: "Book saved!",
          description: "We've added the book to your booklist",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          position: "top",
          title: "Failed",
          description: "There was an error in adding your book",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
  };
  //REVIEW - Firestore

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://openlibrary.org/authors/${key}/works.json`
        );
        setAuthorBook(response.data.entries);
        setIsLoading(false);
      } catch (error) {
        console.log("author_name_index error:", error);
      }
    }
    fetchData();
  }, []);
  // selectedAuthor
  return (
    <>
      <Layout>
        {name && (
          <>
            <VStack>
              <Box>
                <VStack mb={7}>
                  <Text as="b" fontSize="lg" noOfLines={2}>
                    Select your favorites book from your chosen author and
                    publish it to the dashboard or save it to your bookshelf.
                  </Text>
                  <Text>
                    You can share your book with the community and to other
                    people who are looking for inspiration
                  </Text>
                  <Text>
                    Or you can save your books to your bookshelf to keep track
                    of your books
                  </Text>
                </VStack>

                <VStack>
                  <Button>
                    <Link href="/"> back to homepage</Link>
                  </Button>
                  <Text fontSize="3xl">{selectedAuthor.name}</Text>
                  <Image
                    boxSize="200px"
                    objectFit="contain"
                    src={`https://covers.openlibrary.org/a/olid/${key}-M.jpg`}
                    fallbackSrc="/images/nocover.png"
                  />
                </VStack>
              </Box>
              <Box minWidth="70vw">
                {authorBook &&
                  authorBook.map((item, index) => {
                    return (
                      <Flex alignItems="center" mb={2} key={index}>
                        <Image
                          boxSize="120px"
                          objectFit="contain"
                          src={`https://covers.openlibrary.org/b/id/${item.covers}-M.jpg`}
                          alt="book cover"
                          fallbackSrc="/images/nocover.png"
                          ml={3}
                        />

                        <Text fontSize="md" as="b">
                          {item.title}
                        </Text>
                        <Spacer />
                        <VStack>
                          <Text
                            fontSize="sm"
                            color="blue.700"
                            as="button"
                            onClick={handleItemClickBook(item)}
                            _hover={{
                              bg: "lightgrey",
                            }}
                          >
                            Publish
                          </Text>
                          <Divider />
                          <Text
                            fontSize="sm"
                            color="red.700"
                            as="button"
                            onClick={handleItemClickLibrary(item)}
                            _hover={{
                              bg: "lightgrey",
                            }}
                          >
                            Add to my collection
                          </Text>
                        </VStack>
                      </Flex>
                    );
                  })}
              </Box>
            </VStack>
          </>
        )}
        {!name && (
          <VStack minHeight="75vh">
            <Text fontSize="6xl">404</Text>
            <Button>
              <Link href="/"> back to homepage</Link>
            </Button>
          </VStack>
        )}
      </Layout>
    </>
  );
};
export default index;
