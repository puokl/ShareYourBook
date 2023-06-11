import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { AiFillGithub } from "react-icons/ai";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80px"
        bg="blue.700"
        zIndex="2ß"
        color="white"
      >
        <Text>
          This app was build using the API from{" "}
          <Link href="https://openlibrary.org/">
            <Text as="b">Open Library</Text>
          </Link>
        </Text>
        <Flex direction="row" alignItems="center">
          <Text mr={2}>A project by: </Text> <AiFillGithub />
          <Link href="https://github.com/puokl">Phuoc</Link>
        </Flex>
      </Flex>
    </>
  );
};
export default Footer;

// position="relative" bottom="0" left="0"
