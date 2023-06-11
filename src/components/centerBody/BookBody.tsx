import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { BookContext } from "@/context/BookContext";
import { Flex, HStack, Text, Image, Avatar } from "@chakra-ui/react";
import { arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { AiOutlineHeart } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { BookType } from "@/types/bookType";
import {
  capitalizeWords,
  checkUndefinedURL,
  formattedDate,
} from "@/utils/utils";

type BookBodyProps = {
  book: BookType;
  photoURL: string;
  handleShowComments: () => void;
};

const BookBody: React.FC<BookBodyProps> = ({
  book,
  photoURL,
  handleShowComments,
}) => {
  const { user } = useContext(AuthContext);

  const deleteBook = () => {
    if (book.id) {
      const deleteBookRef = doc(database, "books", book.id);
      console.log("clicked");
      return deleteDoc(deleteBookRef)
        .then(() => {
          console.log("doc deleted");
        })
        .catch((err) => {
          console.log("deleteBook error", err.message);
        });
    }
  };

  const handleLikeClick = (item: BookType) => {
    if (item.id) {
      const booksDocRef = doc(database, "books", item.id);

      updateDoc(booksDocRef, {
        like: arrayUnion(user?.email),
      }).catch((err) => {
        alert(err.message);
        console.log("err.message", err.message);
      });
    } else {
      console.log("handleLikeClick error", "cannot find the book");
    }
  };

  return (
    <Flex justifyContent="space-around" direction="column">
      <Flex>
        <Flex direction="column" ml="20px">
          <Flex alignItems="center" mb={4}>
            <Avatar
              src={photoURL}
              size={"xs"}
              name={book ? book?.username : ""}
            />
            <Text fontSize="sm" as="b" ml="20px" pr={4}>
              {capitalizeWords(book.username)}
            </Text>
            <Text fontSize="xs" as="samp">
              {formattedDate(book.date)}
            </Text>
          </Flex>
          <Flex mb={4}>
            <Image
              boxSize="150px"
              objectFit="contain"
              src={checkUndefinedURL(book.cover)}
              alt="book cover"
              fallbackSrc="/images/nocover.png"
              ml={15}
            />
            <Flex direction="column" ml={3}>
              <Text fontSize="md" as="b">
                {book.bookName}
              </Text>
              <Text fontSize="xs" as="cite">
                {book.authorName}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex width="auto" height="65px"></Flex>
      </Flex>
      <Flex>
        <HStack w="100%" spacing={50} pl={5}>
          <HStack>
            <Text
              as="button"
              onClick={() => handleShowComments()}
              fontSize="sm"
            >
              {book.comment ? book.comment.length : 0} comments
            </Text>
            <GoComment />
          </HStack>

          <HStack ml="50px">
            <button onClick={() => handleLikeClick(book)}>
              <AiOutlineHeart />
            </button>
            <Text fontSize="sm">
              {book.like ? book.like.length : 0}{" "}
              {book.like.length === 1 ? "like" : "likes"}
            </Text>
          </HStack>
          {user?.email === book.email && (
            <Text
              as="button"
              onClick={deleteBook}
              color="blue.500"
              fontSize="sm"
            >
              Delete
            </Text>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
};
export default BookBody;
