import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type LeftProps = {};

const Left: React.FC<LeftProps> = () => {
  return (
    <Flex width="20vw" bg="lightgreen">
      Hello from the left
    </Flex>
  );
};
export default Left;
