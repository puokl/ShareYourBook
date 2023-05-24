import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { app, database } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type AuthType = {
  email: string;
  password: string;
};
export default function Firestore() {
  const [data, setData] = useState({});
  const collectionRef = collection(database, "users");
  //NOTE - Query
  const emailQuery = query(
    collectionRef,
    where("email", "==", "zio@gmail.com")
  );

  const handleInput = (event: any) => {
    let newInput = { [event.target.name]: event.target.value };

    setData({ ...data, ...newInput });
  };

  const handleSubmit = () => {
    addDoc(collectionRef, {
      email: data.email,
      password: data.password,
    })
      .then(() => {
        alert("Data Added");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getData = () => {
    //SECTION - getDocs
    // getDocs(collectionRef).then((response) => {
    //   console.log(
    //     response.docs.map((item) => {
    //       return { ...item.data(), id: item.id };
    //     })
    //   );
    // });

    // NOTE -  to update data in realtime - onSnapshot
    // in the log now i can see the data whenever i change something on data or even if i cancel it directly from firebase
    onSnapshot(collectionRef, (data) => {
      console.log(
        data.docs.map((item) => {
          return item.data();
        })
      );
    });
  };

  const getFilteredData = () => {
    //NOTE - using query
    onSnapshot(emailQuery, (data) => {
      console.log(
        data.docs.map((item) => {
          return item.data();
        })
      );
    });
  };

  const updateData = () => {
    const docToUpdate = doc(database, "users", "UsGgXioMAzTaKSVtpvhf");
    updateDoc(docToUpdate, {
      email: "ABC",
      password: 12345,
    })
      .then(() => {
        alert("Data updated");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const deleteData = () => {
    const docToUpdate = doc(database, "users", "UsGgXioMAzTaKSVtpvhf");
    deleteDoc(docToUpdate)
      .then(() => {
        alert("Data deleted");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      <div>
        <input
          name="email"
          placeholder="Email"
          onChange={(event) => handleInput(event)}
        />
        <input
          name="password"
          placeholder="Password"
          onChange={(event) => handleInput(event)}
        />
        <br />
        <button onClick={handleSubmit}>Add data</button>
        <br />
        <button onClick={getData}>Get data</button>
        <br />
        <button onClick={getFilteredData}>Get filtered data</button>
        <br />
        <button onClick={updateData}>Update data</button>
        <br />
        <button onClick={deleteData}>Delete data</button>
      </div>
    </>
  );
}
