import { formattedDate } from "@/utils/utils";
import { Flex, HStack, Text, Image } from "@chakra-ui/react";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { GoComment } from "react-icons/go";

type BookBodyProps = {};

const BookBody: React.FC<BookBodyProps> = ({
  item,
  handleLikeClick,
  photoURL,
}) => {
  return (
    <Flex justifyContent="space-around" direction="column">
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
    </Flex>
  );
};
export default BookBody;
