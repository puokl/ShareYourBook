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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInput(event)
              }
            />
            <CustomInput
              name="email"
              placeholder="Email"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInput(event)
              }
            />

            <CustomInput
              name="password"
              placeholder="Password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInput(event)
              }
            />
            <CustomInput
              name="confirmPassword"
              placeholder="confirm Password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInput(event)
              }
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
