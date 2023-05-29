import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app, database } from "../firebase/firebaseConfig";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { setDoc, doc, addDoc, getDoc, collection } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextProps {
  register: () => void;
  signUpWithGoogle: () => void;
  signUpWithGithub: () => void;
  modalRegister: () => void;
  signUpForm: SignUpForm;
  setSignUpForm: React.Dispatch<React.SetStateAction<SignUpForm>>;
  logout: () => void;
  login: () => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const auth = getAuth(app);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //FIXME - check signUpForm.password !== signUpForm.confirmPassword
  // if (signUpForm.password !== signUpForm.confirmPassword) {
  //       setError("Passwords do not match");
  //       return;

  const modalRegister = () => {
    const userRef = collection(database, "user");
    createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then(() => {
        updateProfile(auth.currentUser as User, {
          displayName: signUpForm.name,
        });
      })
      .then(() => {
        const user = auth.currentUser;
        console.log("user on register", user);
        return Promise.resolve({ user });
      })
      // .then((res) =>
      //   addDoc(userRef, {
      //     email: "hi",
      //     photoURL: "./images/avatar.jpeg",
      //     username: "hello",
      //     // lastSignInTime: res.lastSignInTime,
      //     // creationTime: res.creationTime,
      //   })
      // )
      .then((res) => {
        const user = res.user;

        setDoc(doc(database, "user", signUpForm.email), {
          email: user.email,
          photoURL: "./images/avatar.jpeg",
          username: signUpForm.name,
        });

        // console.log("setDoc done");
      })
      .then((res) => {
        router.push("/");
      })
      .catch((error) => console.log("Error on modalRegister", error.message));
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then((res) => {
        console.log(res.user);
        sessionStorage.setItem("Token", res.user.accessToken);
        // alert("Registration completed");

        router.push("/");
      })

      .catch((error) =>
        console.log(
          "Error on createUserWithEmailAndPassword(): ",
          error.message
        )
      );
  };

  // const login = () => {
  //   signInWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
  //     .then((res) => {
  //       //   const user = userCredential.user;
  //       console.log("login user", user);
  //       setUser(res.user);
  //       router.push("/");
  //     })

  //     .catch((error) => {
  //       console.log("Error on signInWithEmailAndPassword()", error.message);
  //       setUser(null);
  //     });
  // };

  const login = () => {
    signInWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then((userCredential) => {
        // Retrieve the user document from Firestore
        const userDocRef = doc(database, "user", userCredential.user.email);
        return getDoc(userDocRef).then((userDocSnap) => {
          // Update the lastLoginDate field
          return setDoc(
            userDocRef,
            { lastLoginDate: new Date() },
            { merge: true }
          ).then(() => {
            setUser(userCredential.user);
            router.push("/");
          });
        });
      })
      .catch((error) => {
        console.log("Error on signInWithEmailAndPassword()", error.message);
        setUser(null);
      });
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log("res.user", res.user);
        setUser(res.user);
        router.push("/");
      })
      .catch((error) =>
        console.log("Error on signUpWithGoogle(): ", error.message)
      );
  };

  const signUpWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((res) => {
        console.log("res.user", res.user);
        setUser(res.user);
        router.push("/");
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
        console.log("user email", user.email);
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
        console.log("logout succesfully");
      })
      .catch((error) => {
        console.log("error logging out", error.message);
      });
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
    console.log("user in useEffect on AuthContext", user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        signUpWithGoogle,
        signUpWithGithub,
        register,
        signUpForm,
        setSignUpForm,
        modalRegister,
        error,
        setError,
        avatar,
        setAvatar,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
