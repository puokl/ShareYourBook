import { Flex, Button, Image, Text } from "@chakra-ui/react";
import { updateDoc } from "firebase/firestore";
import React from "react";
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
};

const Comment: React.FC<CommentsProps> = ({
  comment,
  commentIndex,
  deleteComment,
  commentUserPhotoURL,
}) => {
  return (
    <Flex key={commentIndex} justifyContent="center" bg="red.100">
      <Flex width="150px" direction="column">
        <Image
          src={commentUserPhotoURL || "./images/avatar.jpeg"}
          boxSize="25px"
          borderRadius="40%"
        />
      </Flex>
      <Flex direction="column">
        <Flex ml="10px" width="350px" justifyContent="space-between">
          <Flex>
            <Text fontSize="sm" as="b" color="blue.600">
              {comment.username}
            </Text>{" "}
            <Text fontSize="10px" as="samp" ml="10px" mt="2px">
              {formattedDate(comment.date)}
            </Text>
          </Flex>
          <Flex>
            <Button
              size="sx"
              width="100px"
              onClick={() => deleteComment(commentIndex)}
            >
              Delete
            </Button>
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
