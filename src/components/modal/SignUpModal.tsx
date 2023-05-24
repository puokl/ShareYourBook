import { useContext, useState } from "react";
import {
  Input,
  Button,
  Modal,
  useDisclosure,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  Flex,
} from "@chakra-ui/react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
const SignUpModal: React.FC = () => {
  const { signUpForm, setSignUpForm, modalRegister } = useContext(AuthContext);
  const auth = getAuth(app);

  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   // firebase logic
  //   const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     if (error) setError("");
  //     if (signUpForm.password !== signUpForm.confirmPassword) {
  //       setError("Passwords do not match");
  //       return;
  //     }
  //     // passwords match
  //     modalRegister();
  //   };

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
          <Flex
            direction="column"
            width="100%"
            mb={4}
            justifyContent="center"
            textAlign="center"
          >
            <Input
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
            />
            <Input
              name="email"
              placeholder="Email"
              onChange={(event) => handleInput(event)}
            />
            <Input
              name="password"
              placeholder="Password"
              onChange={(event) => handleInput(event)}
            />
            <Input
              name="confirmPassword"
              placeholder="confirm Password"
              onChange={(event) => handleInput(event)}
            />
            <br />
            <Button onClick={modalRegister}>Login</Button>
            <br />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SignUpModal;
