import { Input } from "@chakra-ui/react";

export const CustomInput = (props) => {
  return (
    <Input
      mr={4}
      mb={2}
      fontSize="10pt"
      _placeholder={{ color: "gray.500" }}
      _hover={{
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      _focus={{
        outline: "none",
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      bg="gray.50"
      {...props} // Spread remaining props to the Input component
    />
  );
};
