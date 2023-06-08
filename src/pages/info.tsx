import { AuthContext } from "@/context/AuthContext";
import { Box, ListIcon, ListItem, Text, List, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useContext } from "react";
import { MdCheckCircle } from "react-icons/md";
type infoProps = {};

const info: React.FC<infoProps> = () => {
  return (
    <>
      <Box p={4} bg="gray.200" minH="100vh">
        <Link href="/">
          <Text bg="blackAlpha.400" w="max-content" p={2}>
            Back To Homepage
          </Text>
        </Link>

        <Text fontSize="2xl" as="b">
          Info
        </Text>
        <Text>
          This app is part of the projects developed during the bootcamp at
          CODAC Berlin.
        </Text>
        <Text>
          A user can signUp/Login with email and password or a Google or Github
          account.
        </Text>
        <Text>
          Once logged in the user can search a book by author and publish it to
          the dashboard or save it to the own bookshelf.
        </Text>
        <Text>
          A user can upload a picture to the avatar, comment and like other's
          books.
        </Text>
        <Text>
          A user can delete and edit his/her book or comments from the
          dashboard, but not others'.
        </Text>
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
            Firebase
          </ListItem>
          <ListItem>
            {" "}
            <ListIcon as={MdCheckCircle} color="green.500" />
            Chakra UI
          </ListItem>
        </List>
      </Box>
    </>
  );
};
export default info;
