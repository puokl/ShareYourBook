import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { BookContext } from "@/context/BookContext";
import {
  UnorderedList,
  ListItem,
  Box,
  Text,
  VStack,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { AuthContext } from "@/context/AuthContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [orderBy, setOrderBy] = useState("mostRecent");
  const { bookCollection, setBookCollection } = useContext(BookContext);
  const { user } = useContext(AuthContext);

  let sortedBooks = [...bookCollection];
  if (orderBy === "mostRecent") {
    sortedBooks = sortedBooks.sort(
      (a, b) => +new Date(b.date) - +new Date(a.date)
    );
  } else if (orderBy === "mostCommented") {
    sortedBooks = sortedBooks.sort((a, b) => {
      const aComments = a.comment?.length || 0;
      const bComments = b.comment?.length || 0;
      return bComments - aComments;
    });
  } else if (orderBy === "mostLiked") {
    sortedBooks = sortedBooks.sort((a, b) => b.like.length - a.like.length);
  }
  useEffect(() => {
    // Apply the sorting logic based on the `orderBy` state

    setBookCollection(sortedBooks);
  }, [orderBy, setBookCollection]);

  const handleOrderChange = (option: string) => {
    setOrderBy(option);
  };

  return (
    <>
      {user && (
        <Box width={140} pl={3} h="auto">
          <Flex direction="column">
            <Text fontSize={13} m={2} mt={10}>
              <Text as="b" fontSize={12}>
                {bookCollection.length}
              </Text>{" "}
              Published books
            </Text>
          </Flex>
          <Text fontSize={15} m={2} mt={4}>
            Display by:
          </Text>
          <UnorderedList
            display="flex"
            flexDirection="column"
            listStyleType="none"
            fontSize={11}
            p={0}
            m={2}
            spacing={1}
          >
            <ListItem
              onClick={() => handleOrderChange("mostRecent")}
              fontWeight={orderBy === "mostRecent" ? "bold" : "normal"}
              cursor="pointer"
              mr={2}
            >
              Most Recent
            </ListItem>
            <ListItem
              onClick={() => handleOrderChange("mostCommented")}
              fontWeight={orderBy === "mostCommented" ? "bold" : "normal"}
              cursor="pointer"
              mr={2}
            >
              Most Commented
            </ListItem>
            <ListItem
              onClick={() => handleOrderChange("mostLiked")}
              fontWeight={orderBy === "mostLiked" ? "bold" : "normal"}
              cursor="pointer"
              mr={2}
            >
              Most Liked
            </ListItem>
          </UnorderedList>
        </Box>
      )}
    </>
  );
};

export default BookList;
