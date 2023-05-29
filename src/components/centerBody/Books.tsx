import { Flex, Image, Text, HStack, Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { formattedDate } from "./../../utils/utils";
import { GoComment } from "react-icons/go";
import { AiOutlineHeart } from "react-icons/ai";
import Comment from "./Comments";
import BookBody from "./BookBody";
import { BookType, SignleCommentType } from "@/types/bookType";

type BookProps = {
  item: BookType;
  userAvatar: any[];
  handleLikeClick: (item: any) => void;
  visibleComments: number;
  deleteComment: (itemId: string, commentIndex: number) => void;
  handleShowMore: () => void;
  handleShowLess: () => void;
  commentInputs: Record<string, string>;
  setCommentInput: (itemId: string, value: string) => void;
  addComment: (itemId: string) => void;
};

const Book: React.FC<BookProps> = ({
  item,
  userAvatar,
  handleLikeClick,
  deleteComment,
  commentInputs,
  setCommentInput,
  addComment,
}) => {
  const [visibleComments, setVisibleComments] = useState(2);
  const { email } = item;
  const user = userAvatar.find((user) => user.email === email);
  const photoURL = user ? user.photoURL : null;

  const handleShowMore = () => {
    setVisibleComments(visibleComments + 5);
  };

  const handleShowLess = () => {
    setVisibleComments(Math.max(visibleComments - 5, 2));
  };

  return (
    <Flex key={item.id} direction="column">
      <BookBody
        item={item}
        handleLikeClick={handleLikeClick}
        photoURL={photoURL}
      />

      {/* COMMENTS SECTION */}
      <Flex direction="column">
        {item.comment &&
          item.comment
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
                  key={commentIndex}
                  comment={comment}
                  commentIndex={commentIndex}
                  commentUserPhotoURL={commentUserPhotoURL}
                  deleteComment={(commentIndex) =>
                    deleteComment(item.id, commentIndex)
                  }
                />
              );
            })}
        {item.comment && item.comment.length > visibleComments && (
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
      <Flex bg="white">
        <Input
          type="text"
          value={commentInputs[item.id] || ""}
          onChange={(e) => setCommentInput(item.id, e.target.value)}
        />

        <Button onClick={() => addComment(item.id)}>Add Comment</Button>
      </Flex>
    </Flex>
  );
};

export default Book;
