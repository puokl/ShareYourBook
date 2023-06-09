import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app, database } from "../firebase/firebaseConfig";
import { useRouter } from "next/router";
import { createContext, useEffect, useState, ReactNode } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { SignUpFormType } from "@/types/userType";

interface AuthContextProps {
  signUpWithGoogle: () => void;
  signUpWithGithub: () => void;
  modalRegister: () => void;
  signUpForm: SignUpFormType;
  setSignUpForm: React.Dispatch<React.SetStateAction<SignUpFormType>>;
  logout: () => void;
  login: () => void;
  error: any;
  setError: React.Dispatch<React.SetStateAction<string>>;

  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userIsLoading: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [error, setError] = useState("");
  // const [avatar, setAvatar] = useState<AvatarUploadedType | null>(null);
  const [userIsLoading, setUserIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [signUpForm, setSignUpForm] = useState<SignUpFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const auth = getAuth(app);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const modalRegister = () => {
    if (!signUpForm.name) {
      setError("Please add a username");
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then(() => {
        updateProfile(auth.currentUser as User, {
          displayName: signUpForm.name,
        });
      })
      .then(() => {
        const user = auth.currentUser;
        console.log("user on register", user);

        return setDoc(doc(database, "user", signUpForm.email), {
          email: user?.email,
          photoURL: "",
          // photoURL: "./images/avatar.jpeg",
          username: signUpForm.name,
          firstLoginDate: new Date(),
          publishedBooks: [],
        });
      })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error on modalRegister", error.message);
      });
  };

  // const modalRegister = async () => {
  //   if (!signUpForm.name) {
  //     setError("Please add a username");
  //     return;
  //   }
  //   if (signUpForm.password !== signUpForm.confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     await createUserWithEmailAndPassword(
  //       auth,
  //       signUpForm.email,
  //       signUpForm.password
  //     );
  //     await updateProfile(auth.currentUser as User, {
  //       displayName: signUpForm.name,
  //     });

  //     const user = auth.currentUser;
  //     console.log("user on register", user);

  //     await setDoc(doc(database, "user", signUpForm.email), {
  //       email: user?.email,
  //       photoURL: "",
  //       // photoURL: "./images/avatar.jpeg",
  //       username: signUpForm.name,
  //       firstLoginDate: new Date(),
  //       publishedBooks: [],
  //     });

  //     router.push("/");
  //   } catch (error) {
  //     setError(error.message);
  //     console.log("Error on modalRegister", error.message);
  //   }
  // };

  const login = () => {
    signInWithEmailAndPassword(
      auth,
      signUpForm.email,
      signUpForm.password
    ).then((res) => {
      if (res.user.email) {
        const userDocRef = doc(database, "user", res.user.email);
        return getDoc(userDocRef)
          .then(() => {
            setDoc(userDocRef, { lastLoginDate: new Date() }, { merge: true });
            setUser(res.user);
            setUserIsLoading(false);
            router.push("/");
          })
          .catch((error) => {
            setError(error);
            console.log("Error on signInWithEmailAndPassword()", error.message);
            setUser(null);
          });
      } else {
        setError(error);
        console.log(
          "signInWithEmailAndPassword error",
          "cannot find the user email"
        );
      }
    });
  };

  // const login = async () => {
  //   try {
  //     const res = await signInWithEmailAndPassword(
  //       auth,
  //       signUpForm.email,
  //       signUpForm.password
  //     );

  //     if (res.user.email) {
  //       const userDocRef = doc(database, "user", res.user.email);
  //       await getDoc(userDocRef);
  //       await setDoc(
  //         userDocRef,
  //         { lastLoginDate: new Date() },
  //         { merge: true }
  //       );

  //       setUser(res.user);
  //       setUserIsLoading(false);
  //       router.push("/");
  //     } else {
  //       setError("Cannot find the user email");
  //       console.log(
  //         "signInWithEmailAndPassword error: cannot find the user email"
  //       );
  //     }
  //   } catch (error) {
  //     setError(error);
  //     console.log("Error on signInWithEmailAndPassword()", error.message);
  //     setUser(null);
  //   }
  // };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        if (res.user.email) {
          const userDocRef = doc(database, "user", res.user.email);

          // Check if the user document exists
          return getDoc(userDocRef).then((userDocSnap) => {
            if (userDocSnap.exists()) {
              // User document exists, update the lastLoginDate field
              return setDoc(
                userDocRef,
                { lastLoginDate: new Date() },
                { merge: true }
              ).then(() => {
                setUser(res.user);
                setUserIsLoading(false);
                router.push("/");
              });
            } else {
              // User document does not exist, perform first-time login actions

              const userData = {
                email: res.user.email,
                firstLoginDate: new Date(),
                username: res.user.displayName,
                publishedBooks: [],
              };

              return setDoc(userDocRef, userData).then(() => {
                setUser(res.user);
                router.push("/");
              });
            }
          });
        }
      })
      .catch((error) =>
        console.log("Error on signUpWithGoogle(): ", error.message)
      );
  };

  const signUpWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((res) => {
        if (res.user.email) {
          const userDocRef = doc(database, "user", res.user.email);

          return getDoc(userDocRef).then((userDocSnap) => {
            if (userDocSnap.exists()) {
              return setDoc(
                userDocRef,
                { lastLoginDate: new Date() },
                { merge: true }
              ).then(() => {
                setUser(res.user);
                setUserIsLoading(false);
                router.push("/");
              });
            } else {
              const userData = {
                email: res.user.email,
                firstLoginDate: new Date(),
                username: res.user.displayName,
                publishedBooks: [],
              };

              return setDoc(userDocRef, userData).then(() => {
                setUser(res.user);
                router.push("/");
              });
            }
          });
        }
      })
      .catch((error) =>
        console.log("Error on signUpWithGithub()", error.message)
      );
  };

  const checkIfUserIsLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user is logged in", user);
        setUser(user);
      } else {
        console.log("user is not logged in");
        setUser(null);
      }
    });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserIsLoading(true);
        console.log("logout succesfully");
        router.push("/");
      })
      .catch((error) => {
        console.log("error logging out", error.message);
      });
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
    console.log("user in useEffect on AuthContext", user);
    console.log("auth", auth);
    console.log("auth.currentUser", auth.currentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        signUpWithGoogle,
        signUpWithGithub,
        signUpForm,
        setSignUpForm,
        modalRegister,
        error,
        setError,
        user,
        setUser,
        userIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
