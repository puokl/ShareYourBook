import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  Image,
  Avatar,
  Center,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginModal } from "../modal/LoginModal";
import SignUp from "../modal/SignUpModal";
import SearchInput from "./SearchInput";
import { app, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AvatarMenu from "./AvatarMenu";
import { InfoOutlineIcon, MoonIcon, SunIcon, InfoIcon } from "@chakra-ui/icons";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const { logout, signUpWithGoogle, signUpForm, user } =
    useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();
  //SECTION -

  const { avatar, setAvatar } = useContext(AuthContext);
  const handleSubmitAvatar = () => {
    // const storageRef = ref(storage, data.name);
    // to store it inside a images folder
    const storageRef = ref(storage, `images/${avatar.name}`);
    const uploadTask = uploadBytesResumable(storageRef, avatar);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatar(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  //SECTION -

  return (
    <Flex
      bg="blue.700"
      padding={2}
      // justifyContent="space-between"
      justifyContent={{ md: "space-between" }}
      display="flex"
      minHeight="55px"
      pr={5}
      pl={5}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
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
          // chakra is mobile first, base none means when mobile size not show
        >
          <Link href="/"> Share Your Book</Link>
        </Text>
      </Flex>
      <Flex minWidth="600px">
        <SearchInput />
      </Flex>
      {/* <Flex>Here goes the searchbar</Flex> */}

      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <Link href="/info">
          {/* <InfoOutlineIcon mt={3} /> */}
          <InfoIcon mt={3} />
        </Link>
        {/* <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button> */}
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
