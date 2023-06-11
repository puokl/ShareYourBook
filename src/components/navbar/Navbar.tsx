import { AuthContext } from "@/context/AuthContext";
import { Flex, Stack, Text, Image } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginModal } from "../modal/LoginModal";
import SignUp from "../modal/SignUpModal";
import SearchInput from "./SearchInput";
import AvatarMenu from "./AvatarMenu";
import { InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Flex
      bg="blue.700"
      padding={2}
      // justifyContent="space-between"
      justifyContent={{ md: "space-between" }}
      display="flex"
      maxHeight="50px"
      pr={7}
      pl={7}
      alignItems="center"
    >
      <Flex
        align="center"
        width={{ base: "60px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
      >
        <Link href="/">
          {" "}
          <Image src="/images/book.png" height="30px" />
        </Link>
        <Text
          display={{ base: "none", md: "unset" }}
          ml={5}
          as="b"
          color="white"
        >
          <Link href="/"> Share Your Book</Link>
        </Text>
      </Flex>
      <Flex minWidth={{ base: "100px", md: "600px" }}>
        <SearchInput />
      </Flex>
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <Link href="/info">
          <InfoIcon mt={3} color="gray.200" />
        </Link>
        {!user && (
          <>
            <LoginModal />
            <SignUp />
          </>
        )}
        {user && <AvatarMenu />}
      </Stack>
    </Flex>
  );
};
export default Navbar;
