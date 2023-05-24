import Layout from "@/components/Layout";
import { BookContext } from "@/context/BookContext";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect } from "react";

import { useRouter } from "next/router";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { authorName, bookName, selectedAuthor, setSelectedAuthor } =
    useContext(BookContext);
  const testname = authorName[0];
  setSelectedAuthor(testname);

  console.log("selectedAuthor", selectedAuthor?.name);
  console.log("selectedAuthor", selectedAuthor);
  console.log("authorName", authorName[0]?.name);
  console.log("authorName", typeof authorName);

  return (
    <>
      <Flex width="100vw">
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} width="100%">
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Box>Logo</Box>

            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                {/* <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button> */}

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex direction="column">
        <div>were you looking for {selectedAuthor?.name}?</div>
        <div>key: {selectedAuthor?.key}</div>
        <div>birth date: {selectedAuthor?.birth_date}</div>
        <div>death date: {selectedAuthor?.death_date}</div>
        <div>top_work: {selectedAuthor?.top_work}</div>
        <Button onClick={() => router.push("/hello/one")}></Button>
        {/* {authorName &&
          authorName.map((item) => (
            <ul>
              <li>{item.name}</li>
            </ul>
          ))} */}
      </Flex>
    </>
  );
};
export default index;
