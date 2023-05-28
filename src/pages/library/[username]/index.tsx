import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { database } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import Layout from "@/components/Layout";
type indexProps = {};

const index: React.FC<indexProps> = () => {
  const { user } = useContext(AuthContext);
  const [libraryData, setLibraryData] = useState({});
  // const libraryCollectionRef = collection(database, "library");

  const getLibrary = async () => {
    console.log("user", user);
    const currentUser: string = user?.displayName;
    const docRef = doc(database, "library", currentUser);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setLibraryData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    //ANCHOR -
    //   const querySnapshot = await getDocs(collection(database, "library"));
    //   const libraryArray = [];
    //   querySnapshot.forEach((doc) => {
    //     console.log("doc", doc.data());
    //     console.log(`${doc.id} => ${doc.data()}`);
    //     libraryArray.push(doc.data());
    //   });
    //   setLibraryData(libraryArray);
  };

  useEffect(() => {
    getLibrary();
  }, []);

  return (
    <>
      <Layout>
        {user?.displayName ?? <div>Hi {user?.displayName}</div>}
        {console.log("libraryData", libraryData)}
        {/* <div>Hi there</div>
      {libraryData &&
        libraryData.libri.map((item, index) => {
          <div key={index}>
            <p>{item.initialized}</p>{" "}
          </div>;
        })} */}
      </Layout>
    </>
  );
};
export default index;
