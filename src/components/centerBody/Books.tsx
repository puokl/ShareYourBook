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
      {/* <Flex justifyContent="space-around" direction="column">
        <Flex>
          <Flex direction="column" ml="20px">
            <Flex>
              <Image src={photoURL} boxSize="25px" borderRadius="40%" />
              <Text fontSize="sm" as="b" ml="20px">
                {item.username}
              </Text>
            </Flex>
            <Text fontSize="sm" as="b">
              {item.bookName}
            </Text>
            <Text fontSize="xs">
              by:{" "}
              <Text fontSize="sm" as="b">
                {item.authorName}
              </Text>
            </Text>
            <Text fontSize="xs">
              posted:{" "}
              <Text fontSize="sm" as="b">
                {formattedDate(item.date)}
              </Text>
            </Text>
          </Flex>
          <Flex width="auto" height="65px">
            <Image
              layout="fill"
              objectFit="contain"
              src={item.cover}
              alt="book cover"
              fallbackSrc=""
              ml="100px"
            />
          </Flex>
        </Flex>
        <Flex>
          <HStack>
            <Text>{item.comment ? item.comment.length : 0} comments</Text>
            <GoComment />
          </HStack>
          <HStack ml="50px">
            <button onClick={() => handleLikeClick(item)}>
              <AiOutlineHeart />
            </button>
            <Text>
              {item.like ? item.like.length : 0}{" "}
              {item.like.length === 1 ? "like" : "likes"}
            </Text>
          </HStack>
        </Flex>
      </Flex> */}

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
