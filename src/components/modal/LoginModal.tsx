import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Image,
  Text,
  Flex,
  Input,
} from "@chakra-ui/react";
import { CustomInput } from "@/utils/CustomComponent";

export function LoginModal() {
  const {
    signUpWithGoogle,
    signUpWithGithub,
    signUpForm,
    setSignUpForm,
    error,
    login,
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
          <ModalHeader textAlign="center">Log In</ModalHeader>
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
              pr={3}
              pl={3}
              direction="column"
              width="100%"
              mb={4}
              justifyContent="center"
              textAlign="center"
            >
              <Text color="gray.500" fontWeight={700}>
                OR
              </Text>

              <CustomInput
                name="email"
                placeholder="email"
                onChange={(event) => handleInput(event)}
                type="email"
              />
              <CustomInput
                name="password"
                placeholder="password"
                onChange={(event) => handleInput(event)}
                type="password"
              />
              {error && (
                <Text textAlign="center" color="red" fontSize="10pt">
                  {error.message}
                </Text>
              )}

              <Button onClick={login}>Log In</Button>
            </Flex>
          </main>

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
