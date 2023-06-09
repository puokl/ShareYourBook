import { useState } from "react";
import { Flex, Button, Input, Divider } from "@chakra-ui/react";
import Comment from "./Comments";
import BookBody from "./BookBody";
import { BookType } from "@/types/bookType";

type BookProps = {
  book: BookType;
  userAvatar: any[];
  deleteComment: (itemId: string, commentIndex: number) => void;
  commentInputs: Record<string, string>;
  setCommentInput: (itemId: string, value: string) => void;
  addComment: (itemId: string) => void;
};

const Books: React.FC<BookProps> = ({
  book,
  userAvatar,
  deleteComment,
  commentInputs,
  setCommentInput,
  addComment,
}) => {
  const [visibleComments, setVisibleComments] = useState(2);
  const { email } = book;
  const user = userAvatar.find((user) => user.email === email);
  const photoURL = user ? user.photoURL : null;

  const handleShowMore = () => {
    setVisibleComments(visibleComments + 5);
  };

  const handleShowLess = () => {
    setVisibleComments(Math.max(visibleComments - 5, 2));
  };
  const [showComments, setShowComments] = useState<boolean>(false);
  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Flex key={book.id} direction="column" mb={4}>
      <BookBody
        book={book}
        photoURL={photoURL}
        setShowComments={setShowComments}
        showComments
        handleShowComments={handleShowComments}
      />

      {/* COMMENTS SECTION */}
      {/* {console.log("showComments", showComments)} */}
      {showComments && (
        <Flex direction="column">
          {book.comment &&
            book.comment
              .slice(0, visibleComments)
              .map((comment, commentIndex) => {
                const commentUser = userAvatar.find(
                  (user) => user.username === comment.username
                );
                const commentUserPhotoURL = commentUser
                  ? commentUser.photoURL
                  : null;
                return (
                  <Comment
                    bookId={book.id}
                    comment={comment}
                    commentIndex={commentIndex}
                    commentUserPhotoURL={commentUserPhotoURL}
                    deleteComment={(commentIndex) =>
                      deleteComment(book.id, commentIndex)
                    }
                  />
                );
              })}
          {book.comment && book.comment.length > visibleComments && (
            <Flex justifyContent="center">
              <Button size="sx" onClick={handleShowMore}>
                Show More
              </Button>
            </Flex>
          )}

          {visibleComments > 2 && (
            <Flex justifyContent="center">
              <Button size="sx" onClick={handleShowLess}>
                Show Less
              </Button>
            </Flex>
          )}
        </Flex>
      )}
      <Flex h={7} m={2} bg="gray.100">
        <Input
          placeholder="Join the discussion"
          h="auto"
          type="text"
          value={commentInputs[book.id] || ""}
          onChange={(e) => setCommentInput(book.id, e.target.value)}
        />
        {/* <Text
          as="button"
          onClick={() => addComment(book.id)}
          h={7}
          fontSize="sm"
          fontWeight="bold"
        ></Text> */}
        <Button onClick={() => addComment(book.id)} h={7} bg="gray.300">
          Add Comment
        </Button>
      </Flex>
      <Divider borderColor="blue.700" />
    </Flex>
  );
};

export default Books;
