import { database } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { ReactNode, createContext, useContext, useState } from "react";

interface UserContextProps {
  //   email: string;
  //   photoURL: string;
  //   username: string;
  //   lastSignInTime: string;
  //   creationTime: string;
  createUserCollection?: (item: Object) => void;
  user: object | null;
  setUser: React.Dispatch<React.SetStateAction<object>>;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextProps);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState({});
  const userRef = collection(database, "user");

  const createUserCollection = (item) => {
    addDoc(userRef, {
      email: item.displayName,
      photoURL: "" ? "./images/avatar.jpeg" : item.photoURL,
      username: item.username,
      lastSignInTime: item.lastSignInTime,
      creationTime: item.creationTime,
    }).catch((err) => {
      alert(err.message);
      console.log("err.message", err.message);
    });
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        createUserCollection,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
