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
import { setDoc, doc, addDoc, getDoc } from "firebase/firestore";

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
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  signUpForm: SignUpForm;
  setSignUpForm: React.Dispatch<React.SetStateAction<SignUpForm>>;
  logout: () => void;
  login: () => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
// export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");

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
    createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then(() => {
        updateProfile(auth.currentUser as User, {
          displayName: signUpForm.name,
        });
      })
      .then(() => {
        const user = auth.currentUser;
        return Promise.resolve({ user });
      })
      .then((res) => {
        sessionStorage.setItem("Token", res.user.accessToken);
        // alert("Registration completed");
        setIsLoggedIn(true);
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
        setIsLoggedIn(true);

        router.push("/");
      })
      .catch(
        (error) => console.log(error.message)
        // console.log("Error on createUserWithEmailAndPassword()", error)
      );
  };
  //FIXME - use onAuthStateChanged instead of saving in sessionstorage in a useeffect
  const login = () => {
    signInWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
      .then((res) => {
        console.log("res", res);
        console.log("res.user", res.user.displayName);
        sessionStorage.setItem("Token", res.user.accessToken);
        sessionStorage.setItem("user", res.user.displayName);
        setUsername(res.user.displayName);
        setIsLoggedIn(true);
        router.push("/");
      })
      .catch(
        (error) => setError(error.message)
        // console.log(error.message)
      );
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log("res.user", res.user);
        sessionStorage.setItem("Token", res.user.accessToken);

        sessionStorage.setItem("user", res.user.displayName);
        setUsername(res.user.displayName);
        setIsLoggedIn(true);
        console.log(username);
        router.push("/");
      })
      .catch(
        (error) => console.log(error.message)
        // console.log("Error on signUpWithGoogle()", error));
      );
  };

  const signUpWithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then((res) => {
        console.log(res.user);
        sessionStorage.setItem("Token", res.user.accessToken);
        sessionStorage.setItem("user", res.user.displayName);
        setUsername(res.user.displayName);
        setIsLoggedIn(true);
        router.push("/");
      })
      .catch(
        (error) => console.log(error.message)
        //console.log("Error on signUpWithGithub()", error)
      );
  };

  //FIXME - use signout method from firebase
  const logout = () => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("user");
    setSignUpForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsLoggedIn(false);
    setUsername("");
    router.push("/register");
  };

  //FIXME - move it somewhere else, it is always called
  useEffect(() => {
    let token = sessionStorage.getItem("Token");
    setUsername(sessionStorage.getItem("user"));
    console.log("useeffect triggered");
    if (token) {
      setIsLoggedIn(true);
      // router.push("/");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        signUpWithGoogle,
        signUpWithGithub,
        register,
        isLoggedIn,
        signUpForm,
        setSignUpForm,
        modalRegister,
        error,
        setError,
        username,
        setIsLoggedIn,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
