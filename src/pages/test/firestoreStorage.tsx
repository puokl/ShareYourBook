import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { app, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useState } from "react";

//LINK - https://firebase.google.com/docs/storage/web/upload-files

const inter = Inter({ subsets: ["latin"] });

type AuthType = {
  email: string;
  password: string;
};
export default function Firestore() {
  const [data, setData] = useState({});

  const handleSubmit = () => {
    // const storageRef = ref(storage, data.name);
    // to store it inside a images folder
    const storageRef = ref(storage, `images/${data.name}`);
    const uploadTask = uploadBytesResumable(storageRef, data);
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
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  return (
    <>
      <div>
        <input
          type="file"
          onChange={(event) => setData(event.target.files[0])}
        />
        <br />
        <button onClick={handleSubmit}>Add data</button>
      </div>
    </>
  );
}
