import { Box, ListIcon, ListItem, Text, List, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { MdCheckCircle } from "react-icons/md";
import { CheckIcon } from "@chakra-ui/icons";
type infoProps = {};

const info: React.FC<infoProps> = () => {
  return (
    <>
      <Flex p={4} bg="gray.200" minH="100vh" direction="column">
        <Link href="/">
          <Text bg="blackAlpha.400" w="max-content" p={2}>
            Back To Homepage
          </Text>
        </Link>

        <Text fontSize="2xl" as="b" textAlign="center" mb={2}>
          Info
        </Text>
        <Text textAlign="center" mb={3}>
          This app is part of the projects developed during the bootcamp at
          CODAC Berlin.
        </Text>

        <List>
          <ListItem>
            <CheckIcon color="gray.400" mr={3} />A user can signUp/Login with
            email and password or a Google or Github account.
          </ListItem>
          <ListItem>
            <CheckIcon color="gray.400" mr={3} /> Once logged in the user can
            search a book by author and publish it to the dashboard or save it
            to the own bookshelf.
          </ListItem>
          <ListItem>
            <CheckIcon color="gray.400" mr={3} /> A user can upload a picture to
            the avatar, comment and like other's books.
          </ListItem>
          <ListItem>
            <CheckIcon color="gray.400" mr={3} /> A user can delete and edit
            his/her book or comments from the dashboard, but not others'.
          </ListItem>
        </List>

        <Text mt={3}>This project was built using: </Text>
        <List>
          <ListItem>
            {" "}
            <ListIcon as={MdCheckCircle} color="green.500" />
            NextJs
          </ListItem>
          <ListItem>
            {" "}
            <ListIcon as={MdCheckCircle} color="green.500" />
            Typescript
          </ListItem>
          <ListItem>
            {" "}
            <ListIcon as={MdCheckCircle} color="green.500" />
            Firebase
          </ListItem>
          <ListItem>
            {" "}
            <ListIcon as={MdCheckCircle} color="green.500" />
            Chakra UI
          </ListItem>
        </List>
      </Flex>
    </>
  );
};
export default info;
