import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";

export const addComment = (itemId, comment, user, toast, setCommentInput) => {
  const bookDocRef = doc(database, "books", itemId);

  // Update the document in Firebase with the new comment object
  updateDoc(bookDocRef, {
    comment: arrayUnion({
      text: comment,
      date: new Date().toISOString(),
      username: user?.displayName,
    }),
  })
    .then(() => {
      toast({
        position: "top",
        title: "Comment added!",
        description: "We've added your comment",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setCommentInput(itemId, "");
    })
    .catch((error) => {
      toast({
        position: "top",
        title: "Failed",
        description: "There was an error in adding your comment",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error adding comment:", error);
    });
};

export const deleteComment = (itemId, commentIndex) => {
  const bookDocRef = doc(database, "books", itemId);

  // Remove the specific comment from the array
  const updatedComments = firebaseData[itemId]?.comment || [];
  updatedComments.splice(commentIndex, 1);

  // Update the document in Firebase with the updated comments array
  updateDoc(bookDocRef, {
    comment: updatedComments,
  })
    .then(() => {
      console.log("Comment deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
    });
};

export const getImg = async (item) => {
  const res = await getDoc(doc(database, "user", item.email));
  return res.data().photoURL;
};
