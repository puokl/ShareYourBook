// import {
//   getAuth,
//   GoogleAuthProvider,
//   GithubAuthProvider,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signInWithEmailAndPassword,
//   signInWithPopup,
// } from "firebase/auth";
// import { app } from "../firebase/firebaseConfig";
// import { useRouter } from "next/router";
// import { useState } from "react";

// export const useAuth = () => {
//   const test = "this is a test";
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [error, setError] = useState("");

//   const auth = getAuth(app);
//   const router = useRouter();
//   const googleProvider = new GoogleAuthProvider();
//   const githubProvider = new GithubAuthProvider();

//   const [signUpForm, setSignUpForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   //FIXME - check signUpForm.password !== signUpForm.confirmPassword
//   // if (signUpForm.password !== signUpForm.confirmPassword) {
//   //       setError("Passwords do not match");
//   //       return;

//   const modalRegister = () => {
//     createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
//       .then(() => {
//         updateProfile(auth.currentUser, {
//           displayName: signUpForm.name,
//         });
//       })
//       .then(() => {
//         const user = auth.currentUser;
//         return Promise.resolve({ user });
//       })
//       .then((res) => {
//         sessionStorage.setItem("Token", res.user.accessToken);
//         // alert("Registration completed");
//         setIsLoggedIn(true);
//         router.push("/");
//       })
//       .catch((error) => console.log("Error on modalRegister", error.message));
//   };

//   const register = () => {
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((res) => {
//         console.log(res.user);
//         sessionStorage.setItem("Token", res.user.accessToken);
//         // alert("Registration completed");
//         setIsLoggedIn(true);
//         router.push("/");
//       })
//       .catch(
//         (error) => console.log(error.message)
//         // console.log("Error on createUserWithEmailAndPassword()", error)
//       );
//   };

//   const login = () => {
//     signInWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
//       .then((res) => {
//         console.log("res", res);
//         console.log("res.user", res.user);
//         sessionStorage.setItem("Token", res.user.accessToken);
//         sessionStorage.setItem("user", res.user.displayName);
//         // alert("Registration completed");
//         setIsLoggedIn(true);
//         router.push("/");
//       })
//       .catch(
//         (error) => setError(error.message)
//         // console.log(error.message)
//       );
//   };

//   const signUpWithGoogle = () => {
//     signInWithPopup(auth, googleProvider)
//       .then((res) => {
//         console.log(res.user);
//         sessionStorage.setItem("Token", res.user.accessToken);
//         // alert("Signed In");
//         setIsLoggedIn(true);
//         router.push("/");
//       })
//       .catch(
//         (error) => console.log(error.message)
//         // console.log("Error on signUpWithGoogle()", error));
//       );
//   };

//   const signUpWithGithub = () => {
//     signInWithPopup(auth, githubProvider)
//       .then((res) => {
//         console.log(res.user);
//         sessionStorage.setItem("Token", res.user.accessToken);
//         // alert("Signed In");
//         setIsLoggedIn(true);
//         router.push("/");
//       })
//       .catch(
//         (error) => console.log(error.message)
//         //console.log("Error on signUpWithGithub()", error)
//       );
//   };

//   const logout = () => {
//     sessionStorage.removeItem("Token");
//     sessionStorage.removeItem("user");
//     setSignUpForm({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     });
//     setIsLoggedIn(false);
//     router.push("/register");
//   };

//   return {
//     logout,
//     login,
//     signUpWithGoogle,
//     signUpWithGithub,
//     register,
//     signUpForm,
//     setSignUpForm,
//     error,
//     isLoggedIn,
//     setIsLoggedIn,
//     test,
//   };
// };

export const useAuth = () => {
  const test = "this is a test";
  return { test };
};
