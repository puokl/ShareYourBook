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
import React, { useContext, useState } from "react";
import { app, database, storage } from "../../firebase/firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { AuthContext } from "@/context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import Router from "next/router";

type AvatarUploadedType = {
  lastModified: number;
  lastModifiedDate?: string;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};

const AvatarModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [avatar, setAvatar] = useState<File | null>(null);
  const auth = getAuth();

  const handleSubmitAvatar = () => {
    console.log("auth.currentUser", auth.currentUser);
    const tempUser = auth.currentUser;
    if (avatar && tempUser) {
      const storageRef = ref(storage, `images/${avatar.name}`);
      uploadBytes(storageRef, avatar).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          updateProfile(tempUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              const tempEmail = tempUser.email;
              if (tempEmail) {
                const userDocRef = doc(database, "user", tempEmail);
                updateDoc(userDocRef, { photoURL: downloadURL });
              }
            })
            .then(() => Router.reload())
            .catch((error) => console.log(error));
        });
      });
    }
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Add a picture</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose your avatar</ModalHeader>
          <ModalCloseButton />
          {/* <ModalBody>Hello from body</ModalBody> */}

          <ModalFooter>
            <input
              type="file"
              onChange={(event) =>
                setAvatar(event.target.files ? event.target.files[0] : null)
              }
            />

            <Button onClick={handleSubmitAvatar}>Add Avatar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AvatarModal;

// const handleSubmitAvatar = () => {
//   const storageRef = ref(storage, `images/${avatar?.name}`);
//   const uploadTask = uploadBytesResumable(storageRef, avatar);
//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress =
//         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//     },
//     (error) => {
//       console.log(error.message);
//     },
//     () => {
//       // Upload completed successfully, now we can get the download URL
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         // setAvatar(downloadURL);
//         // console.log("File available at", downloadURL);
//         updateProfile(auth.currentUser, {
//           photoURL: downloadURL,
//         })
//           .then(() => {
//             if (auth.currentUser.email) {
//               const userDocRef = doc(
//                 database,
//                 "user",
//                 auth.currentUser.email
//               );
//               updateDoc(userDocRef, { photoURL: downloadURL });
//               Router.reload();
//             }
//           })

//           .catch((error) => console.log(error));
//       });
//     }
//   );
// };
