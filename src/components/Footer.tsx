import { Flex, HStack, Text } from "@chakra-ui/react";
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
      >
        <Text>
          This app was build using the API from{" "}
          <Link href="https://openlibrary.org/">
            <Text as="b">Open Library</Text>
          </Link>
        </Text>
        <Flex direction="row">
          <Text>A project by:</Text>
          <AiFillGithub />
          <Link href="https://github.com">Phuoc</Link>
        </Flex>
      </Flex>
    </>
  );
};
export default Footer;

// position="relative" bottom="0" left="0"
