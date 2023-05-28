import { AuthContext } from "@/context/AuthContext";
import { BookContext } from "@/context/BookContext";
import { database } from "@/firebase/firebaseConfig";
import {
  Button,
  Flex,
  Image,
  List,
  ListItem,
  Text,
  VStack,
  useToast,
  Spacer,
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
type indexProps = {};

interface AuthorBookProps {
  authors: object[];
  covers: number[];
  created: object;
  key: string;
  last_modified: object;
  latest_revision: number;
  revision: number;
  title: string;
  type: object;
}

const index: React.FC<indexProps> = () => {
  const { setSelectedAuthor, selectedAuthor } = useContext(BookContext);
  const { user } = useContext(AuthContext);
  const [authorBook, setAuthorBook] = useState([]);
  const { name, key } = selectedAuthor;

  const toast = useToast();
  console.log("selectedAuthor", selectedAuthor);
  // const user = sessionStorage.getItem("user");
  //REVIEW - Firestore
  const bookRef = collection(database, "books");

  const handleSubmitBook = (item) => {
    addDoc(bookRef, {
      bookName: item.title,
      date: new Date().toISOString(),
      username: user?.displayName,
      cover: `https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`,
      authorName: selectedAuthor.name,
      like: [],
    })
      .then((docRef) => {
        console.log("docRef", docRef.id);
      })
      .catch((err) => {
        alert(err.message);
        console.log("err.message", err.message);
      });
  };

  const libraryRef = collection(database, "library");

  // //!SECTION
  // var docRef = collection("library").doc(username);
  // docRef
  //   .get()
  //   .then((doc) => {
  //     if (doc.exists) {
  //       console.log("Document data:", doc.data());
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Error getting document:", error);
  //   });
  // //!SECTION
  const handleSubmitLibrary = (item) => {
    // addDoc(libraryRef, { username })
    // if (item) {
    //   const libraryDocRef = doc(database, username, item.title);
    //   updateDoc(
    //     libraryDocRef,
    //     {
    //       bookName: item.title,
    //       date: new Date().toISOString(),
    //       username: username,
    //       cover: `https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`,
    //       authorName: selectedAuthor.name,
    //     }
    //   );
    // }
    // setDoc(doc(database, "library", username), {
    //   bookName: item.title,
    //   date: new Date().toISOString(),
    //   username: username,
    //   cover: `https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`,
    //   authorName: selectedAuthor.name,
    // }).catch((err) => {
    //   alert(err.message);
    //   console.log("err.message", err.message);
    // });

    const libraryDocRef = doc(database, "library", user?.displayName);

    const test = async () => {
      const docSnap = await getDoc(libraryDocRef);
      return docSnap.exists();
    };

    getDoc(libraryDocRef).then((res) => {
      if (res.exists()) {
        updateDoc(libraryDocRef, {
          libri: arrayUnion({
            bookName: item.title,
            date: new Date().toISOString(),
            username: user?.displayName,
            cover: `https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`,
            authorName: selectedAuthor.name,
          }),
        }).catch((err) => {
          alert(err.message);
          console.log("err.message", err.message);
        });
      } else {
        setDoc(doc(database, "library", user?.displayName), {
          initialized: true,
          libri: [
            {
              bookName: item.title,
              date: new Date().toISOString(),
              username: user?.displayName,
              cover: `https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`,
              authorName: selectedAuthor.name,
            },
          ],
        }).catch((err) => {
          alert(err.message);
          console.log("err.message", err.message);
        });
      }
    });
  };

  const handleItemClickLibrary = (item) => {
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

  const handleItemClickBook = (item) => {
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
    const user = sessionStorage.getItem("user");
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://openlibrary.org/authors/${key}/works.json`
        );

        // console.log("fetchedData", response);
        console.log("fetchedData", response.data.entries);
        setAuthorBook(response.data.entries);
        console.log("authorBook", authorBook);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [selectedAuthor]);
  return (
    <>
      {name && (
        <>
          <VStack>
            <Text>this is username: {user?.displayName}</Text>
            <Button>
              <Link href="/"> back to homepage</Link>
            </Button>
            <Text>This is the author page</Text>

            <Text fontSize="2xl">hello from {name}</Text>
            <Flex>
              <Image
                src={`https://covers.openlibrary.org/a/olid/${key}-M.jpg`}
              />
            </Flex>
            <Flex>
              <Text>
                You can publish a book to the dashboard or add it to yout
                library collection
              </Text>
            </Flex>
            <List>
              {authorBook &&
                authorBook.map((item, index) => {
                  return (
                    <Flex alignItems="center">
                      <Image
                        src={`https://covers.openlibrary.org/b/id/${item.covers}-S.jpg`}
                      />
                      <Spacer />
                      <ListItem
                        cursor="pointer"
                        _hover={{
                          bg: "lightgrey",
                        }}
                        key={index}
                        // onClick={handleItemClick(item)}
                      >
                        {item.title}
                      </ListItem>
                      <Button onClick={handleItemClickBook(item)}>
                        Publish
                      </Button>
                      <Button onClick={handleItemClickLibrary(item)}>
                        Add to my collection
                      </Button>
                    </Flex>
                  );
                })}
            </List>
          </VStack>
        </>
      )}
      {!name && (
        <VStack>
          <Text fontSize="6xl">404</Text>
          <Button>
            <Link href="/"> back to homepage</Link>
          </Button>
        </VStack>
      )}
    </>
  );
};
export default index;
