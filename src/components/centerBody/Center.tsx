import { useContext, useEffect, useState } from "react";
import {
  Flex,
  Text,
  useToast,
  Spinner,
  Box,
  textDecoration,
  Divider,
  Stack,
} from "@chakra-ui/react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import Books from "./Books";
import { BookType } from "@/types/bookType";
import { UserType } from "../../types/userType";
import { BookContext } from "@/context/BookContext";
import { AuthContext } from "@/context/AuthContext";

type CenterProps = {};

const Center: React.FC<CenterProps> = () => {
  const [commentInputs, setCommentInputs] = useState({});
  const [userAvatar, setUserAvatar] = useState<UserType[]>([]);
  const { user, userIsLoading } = useContext(AuthContext);
  const { bookCollection, isLoading } = useContext(BookContext);
  const toast = useToast();
  const auth = getAuth();

  const addComment = (itemId: string) => {
    const comment = commentInputs[itemId];
    if (comment) {
      const bookDocRef = doc(database, "books", itemId);

      // Update the document in Firebase with the new comment object
      updateDoc(bookDocRef, {
        comment: arrayUnion({
          text: comment,
          date: new Date().toISOString(),
          username: user?.displayName,
          email: user?.email,
        }),
      })
        .then(() => {
          toast({
            position: "top",
            title: "Comment added!",
            description: "We've added your comment",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          setCommentInput(itemId, "");
        })
        .catch((error) => {
          toast({
            position: "top",
            title: "Failed",
            description: "There was an error in adding your comment",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          console.error("Error adding comment:", error);
        });
    }
  };

  const deleteComment = (bookId, commentIndex) => {
    const bookDocRef = doc(database, "books", bookId);
    const currentComments =
      bookCollection.find((item) => item.id === bookId)?.comment || [];
    const updatedComments = [...currentComments];
    updatedComments.splice(commentIndex, 1);
    updateDoc(bookDocRef, {
      comment: updatedComments,
    })
      .then(() => {
        console.log("Comment deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  const setCommentInput = (itemId, value) => {
    setCommentInputs({ ...commentInputs, [itemId]: value });
  };

  const usersCollectionRef = collection(database, "user");

  const [visibleBooks, setVisibleBooks] = useState(5);

  const loadMoreBooks = () => {
    setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 5);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const snapshot = await getDocs(usersCollectionRef);
        const userData = snapshot.docs.map((doc) => doc.data() as UserType);
        console.log("userData", userData);
        setUserAvatar(userData);
        console.log("userAvatar", userAvatar);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    const unsubscribe = onSnapshot(usersCollectionRef, () => {
      fetchUserData();
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {user && (
        <Flex direction="column" w="100%" bg="gray.200">
          <Text
            fontSize="2xl"
            textAlign="center"
            as="b"
            color="blue.700"
            mb={5}
          >
            Discover the books shared by the Community
          </Text>

          {isLoading ? (
            <Flex alignItems="center" justifyContent="center" height="50vh">
              <Spinner />
            </Flex>
          ) : (
            //SECTION - BOOKS
            <Flex w="100%" justifyContent="space-between">
              {/* <Stack h="100%" direction="row" w="inherit"> */}{" "}
              <Divider orientation="vertical" borderColor="black" />
              <Flex direction="column" w="90%">
                {bookCollection &&
                  bookCollection
                    ?.slice(0, visibleBooks)
                    .map((book: BookType, index: number) => {
                      const { email } = book;
                      const user = userAvatar.find(
                        (user) => user.email === email
                      );
                      const photoURL = user ? user.photoURL : null;
                      // console.log("photoURL", photoURL);

                      return (
                        <Books
                          key={book.id}
                          book={book}
                          userAvatar={userAvatar}
                          commentInputs={commentInputs}
                          setCommentInput={setCommentInput}
                          addComment={addComment}
                          deleteComment={deleteComment}
                        />
                      );
                    })}
                {visibleBooks < bookCollection.length && (
                  <Box textAlign="center" m={4}>
                    <Text
                      as="button"
                      fontWeight="bold"
                      onClick={loadMoreBooks}
                      color="blue.800"
                      fontSize="sm"
                    >
                      Show more ...
                    </Text>
                  </Box>
                )}
              </Flex>
              <Divider orientation="vertical" borderColor="black" />
              {/* </Stack> */}
            </Flex>
          )}
        </Flex>
      )}
      {userIsLoading && !user && (
        <Flex>
          <Text as="b" mt={250}>
            Please login in to join our community and discover what other people
            likes to read!
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Center;
