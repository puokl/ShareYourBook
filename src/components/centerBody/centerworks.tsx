import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";

type CenterProps = {};

const Center: React.FC<CenterProps> = () => {
  const [firebaseData, setFirebaseData] = useState([{}]);
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const collectionRef = collection(database, "books");

  const addComment = (itemId) => {
    const comment = commentInputs[itemId];
    if (comment) {
      const bookDocRef = doc(database, "books", itemId);

      // Update the document in Firebase with the new comment object
      updateDoc(bookDocRef, {
        comment: arrayUnion({
          text: comment,
          date: new Date().toISOString(),
          username: "JohnDoe", // Replace with the actual username
        }),
      })
        .then(() => {
          console.log("Comment added successfully!");
          // Clear the comment input field for the specific item
          setCommentInput(itemId, "");
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
        });
    }
  };

  const deleteComment = (itemId, commentIndex) => {
    const bookDocRef = doc(database, "books", itemId);

    // Get the current comments from the state
    const currentComments =
      firebaseData.find((item) => item.id === itemId)?.comment || [];

    // Remove the specific comment from the array
    const updatedComments = [...currentComments];
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

  const setCommentInput = (itemId, value) => {
    setCommentInputs({ ...commentInputs, [itemId]: value });
  };

  useEffect(() => {
    const getData = () => {
      getDocs(collectionRef)
        .then((response) => {
          const data = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFirebaseData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    };

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      getData();
    });

    return unsubscribe;
  }, []);

  return (
    <Flex width="60vw" bg="lightblue">
      <Text>Hello from the center</Text>
      {isLoading ? ( // Render loading state
        <p>Loading...</p>
      ) : (
        <ul>
          {firebaseData?.map((item, index) => (
            <li key={index}>
              <p>ID: {item.id}</p>
              <p>Book Name: {item.bookName}</p>
              <p>Username: {item.username}</p>

              <ul>
                {/* Iterate through comments for the specific item */}
                {item.comment &&
                  item.comment.map((comment, commentIndex) => (
                    <Card>
                      <CardBody>
                        <Text>Text: {comment.text}</Text>
                        <Text>Date: {comment.date}</Text>
                        <Text>Username: {comment.username}</Text>
                      </CardBody>
                      <Button
                        onClick={() => deleteComment(item.id, commentIndex)}
                      >
                        Delete
                      </Button>
                    </Card>
                    // <li key={commentIndex}>
                    //   <p>Text: {comment.text}</p>
                    //   <p>Date: {comment.date}</p>
                    //   <p>Username: {comment.username}</p>
                    //   <button
                    //     onClick={() => deleteComment(item.id, commentIndex)}
                    //   >
                    //     Delete
                    //   </button>
                    // </li>
                  ))}
              </ul>

              {/* Render other properties as needed */}
              <div>
                <input
                  type="text"
                  value={commentInputs[item.id] || ""}
                  onChange={(e) => setCommentInput(item.id, e.target.value)}
                />
                <button onClick={() => addComment(item.id)}>Add Comment</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Flex>
  );
};
export default Center;
