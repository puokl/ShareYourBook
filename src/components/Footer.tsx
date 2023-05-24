import { Flex } from "@chakra-ui/react";
import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <>
      <Flex
        justifyContent="center"
        marginTop="200"
        height="20"
        bg="blue.100"
        width="100%"
      >
        Footer
      </Flex>
    </>
  );
};
export default Footer;
