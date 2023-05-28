import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  MenuItem,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { app, database, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from "@/context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

type AvatarModalProps = {};

const AvatarModal: React.FC<AvatarModalProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { avatar, setAvatar, logout } = useContext(AuthContext);

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
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => console.log("profile updated"))
            .then(() => {
              const userDocRef = doc(database, "user", auth.currentUser.email);
              updateDoc(userDocRef, { photoURL: downloadURL });
            })
            .then(() => console.log("auth on avatarmodal", auth))
            .catch((error) => console.log(error));

          onClose();
        });
      }
    );
  };
  return (
    <>
      <MenuItem onClick={onOpen}>Add a picture</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose your avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hello from body</ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button> */}
            <input
              type="file"
              onChange={(event) => setAvatar(event.target.files[0])}
            />
            <br />
            <Button onClick={handleSubmitAvatar}>Add avatar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AvatarModal;
