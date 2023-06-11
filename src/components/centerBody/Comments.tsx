import { useContext, useState } from "react";
import { Flex, Text, Textarea, Box, Avatar } from "@chakra-ui/react";
import { updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { database } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { BookContext } from "@/context/BookContext";
import { formattedDate } from "./../../utils/utils";

type CommentsProps = {
  comment: {
    username: string;
    date: string;
    text: string;
  };
  commentIndex: number;
  deleteComment: (commentIndex: number) => void;
  commentUserPhotoURL: string;
  bookId: string;
};

const Comment: React.FC<CommentsProps> = ({
  comment,
  commentIndex,
  deleteComment,
  commentUserPhotoURL,
  bookId,
}) => {
  const [editedComment, setEditedComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const { bookCollection, isLoading } = useContext(BookContext);

  const handleEditClick = () => {
    setEditedComment(comment.text);
    setIsEditing(true);
  };

  const handleSaveEditClick = (bookId: string, commentIndex: number) => {
    console.log("text edited");
    const commentDocRef = doc(database, "books", bookId);
    const book = bookCollection.find((item) => item.id === bookId);
    const currentComments = book?.comment || [];

    console.log("currentComments", currentComments);
    console.log("editedComment", editedComment);
    console.log("[...currentComment]first", { ...currentComments });

    const updatedComments = [...currentComments];

    updatedComments[commentIndex].text = editedComment;

    updateDoc(commentDocRef, { comment: updatedComments })
      .then(() => {
        setIsEditing(false);
        console.log("Comment updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <Flex
      key={commentIndex}
      justifyContent="flex-start"
      bg="gray.300"
      width="100%"
    >
      <Box pos="relative" top="0" left="0" minWidth={8}>
        <Avatar
          src={commentUserPhotoURL}
          size={"xs"}
          name={comment ? comment?.username : ""}
          m={2}
        />
      </Box>
      <Flex direction="column">
        <Flex
          ml="10px"
          mt={1}
          mb={1}
          width="100%"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <Text fontSize="sm" as="b" color="blue.600">
              {comment.username}
            </Text>{" "}
            <Text fontSize="10px" as="samp" ml="10px" mt="2px">
              {formattedDate(comment.date)}
            </Text>
            {/* //FIXME - */}
            {user?.displayName === comment.username && (
              <Box ml={10}>
                {isEditing ? (
                  <>
                    <Textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    {console.log("bookId", bookId)}
                    {console.log("commentIndex", commentIndex)}
                    <Text
                      as="button"
                      onClick={() => handleSaveEditClick(bookId, commentIndex)}
                      fontSize="xs"
                      color="blue.600"
                      mr={4}
                    >
                      {" "}
                      Save
                    </Text>

                    <Text
                      as="button"
                      onClick={handleCancelClick}
                      fontSize="xs"
                      color="blue.600"
                    >
                      {" "}
                      Cancel
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      as="button"
                      onClick={() => deleteComment(commentIndex)}
                      fontSize="xs"
                      color="blue.600"
                      mr={4}
                    >
                      {" "}
                      Delete
                    </Text>

                    <Text
                      as="button"
                      onClick={handleEditClick}
                      fontSize="xs"
                      color="blue.600"
                    >
                      {" "}
                      Edit
                    </Text>
                  </>
                )}
              </Box>
            )}
          </Flex>
        </Flex>
        <Flex>
          <Text fontSize="sm" as="cite">
            "{comment.text}"
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Comment;
