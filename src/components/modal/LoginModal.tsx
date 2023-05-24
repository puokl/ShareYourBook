import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useState } from "react";
import SignUpModal from "./SignUpModal";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Text,
  Flex,
  Input,
} from "@chakra-ui/react";
import { FIREBASE_ERRORS } from "@/firebase/error";

export function LoginModal() {
  const {
    logout,
    login,
    signUpWithGoogle,
    signUpWithGithub,
    register,
    signUpForm,
    setSignUpForm,
    error,
  } = useContext(AuthContext);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => {
    setShowSignUpModal(true);
  };
  const handleInput = (event: any) => {
    let newInput = { [event.target.name]: event.target.value };

    setSignUpForm({ ...signUpForm, ...newInput });
  };
  return (
    <>
      <Button onClick={onOpen}>Log in</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log In</ModalHeader>
          <ModalCloseButton />
          {/* <ModalBody>
            <div>I'm a modal</div>
          </ModalBody> */}
          <main>
            <Flex direction="column" width="100%" mb={4}>
              <Button variant="oauth" mb={2} onClick={() => signUpWithGoogle()}>
                <Image src="/images/googlelogo.png" height="20px" mr={4} />
                Continue with Google
              </Button>
              <Button variant="oauth" mb={2} onClick={() => signUpWithGithub()}>
                <Image src="/images/githublogo.png" height="20px" mr={4} />
                Continue with Github
              </Button>
            </Flex>
            <Flex
              direction="column"
              width="100%"
              mb={4}
              justifyContent="center"
              textAlign="center"
            >
              <Text color="gray.500" fontWeight={700}>
                OR
              </Text>

              <Input
                name="email"
                placeholder="email"
                onChange={(event) => handleInput(event)}
                // value={email}
                type="email"
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
              />
              <Input
                name="password"
                placeholder="password"
                onChange={(event) => handleInput(event)}
                // value={password}
                type="password"
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
              />
              {error && (
                <Text textAlign="center" color="red" fontSize="10pt">
                  {error}
                </Text>
              )}

              <Button onClick={login}>Log In</Button>
            </Flex>
          </main>
          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
          <Flex fontSize="9pt" justifyContent="center">
            <Text mr={1}>New here?</Text>

            <Text
              color="blue.500"
              fontWeight={700}
              cursor="pointer"
              onClick={handleClick}
            >
              SIGN UP
            </Text>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
