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
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginModal } from "../modal/LoginModal";
import SignUp from "../modal/SignUpModal";
import SearchInput from "./SearchInput";
import { app, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AvatarMenu from "./AvatarMenu";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const { isLoggedIn, logout, signUpWithGoogle, signUpForm, setIsLoggedIn } =
    useContext(AuthContext);
  const [username, setUsername] = useState("");
  // console.log("signUpForm", signUpForm);
  // console.log("name", username);

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
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setUsername(user ?? "");
    // setIsLoggedIn(true);
  }, []);

  return (
    <Flex
      bg="gray.100"
      padding={2}
      // justifyContent="space-between"
      justifyContent={{ md: "space-between" }}
      display="flex"
      maxHeight="100px"
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
      >
        <Image src="/images/Book-Vector.jpeg" height="50px" />
        <Text
          display={{ base: "none", md: "unset" }}
          // chakra is mobile first, base none means when mobile size not show
        >
          Book Api
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
        {!username && (
          <>
            <LoginModal />

            <SignUp />
          </>
        )}

        {username && <AvatarMenu />}
      </Stack>
    </Flex>
  );
};
export default Navbar;
