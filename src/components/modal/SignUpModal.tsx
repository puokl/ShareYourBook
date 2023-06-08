import { useContext } from "react";
import {
  Input,
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalOverlay,
  Flex,
  Text,
  ModalHeader,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { CustomInput } from "@/utils/CustomComponent";

const SignUpModal: React.FC = () => {
  const { signUpForm, setSignUpForm, modalRegister, error } =
    useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = getAuth(app);

  const handleInput = (event: any) => {
    let newInput = { [event.target.name]: event.target.value };

    setSignUpForm({ ...signUpForm, ...newInput });
  };
  return (
    <>
      <Button onClick={onOpen}>Sign Up</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Sign Up</ModalHeader>
          <Flex
            pr={3}
            pl={3}
            direction="column"
            width="100%"
            mb={4}
            justifyContent="center"
            textAlign="center"
          >
            <CustomInput
              name="name"
              placeholder="Name"
              onChange={(event) => handleInput(event)}
            />
            <CustomInput
              name="email"
              placeholder="Email"
              onChange={(event) => handleInput(event)}
            />
            {/* <Input
              name="name"
              placeholder="Name"
              onChange={(event) => handleInput(event)}
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
              width="70%"
              justifyContent="center"
            /> */}

            {/* <Input
              name="email"
              placeholder="Email"
              onChange={(event) => handleInput(event)}
            /> */}
            <CustomInput
              name="password"
              placeholder="Password"
              onChange={(event) => handleInput(event)}
            />
            <CustomInput
              name="confirmPassword"
              placeholder="confirm Password"
              onChange={(event) => handleInput(event)}
            />
            {error && (
              <Text as="b" color="tomato">
                {error}
              </Text>
            )}
            <br />
            <Button onClick={modalRegister}>Sign Up</Button>
            <br />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SignUpModal;
