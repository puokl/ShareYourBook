import { app } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";

export const login = (
  signUpForm,
  setUser,
  setDoc,
  getDoc,
  database,
  router
) => {
  const auth = getAuth(app);
  const { email, password } = signUpForm;
  console.log("first");
  signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      const userDocRef = doc(database, "user", res.user.email);
      console.log("second");
      return getDoc(userDocRef).then(() => {
        // Update the lastLoginDate field
        console.log("third");
        return setDoc(
          userDocRef,
          { lastLoginDate: new Date() },
          { merge: true }
        ).then((res) => {
          console.log("fourth");
          setUser(res.user);
          router.push("/");
        });
      });
    })
    .catch((error) => {
      console.log("Error on signInWithEmailAndPassword()", error.message);
      setUser(null);
    });
};
