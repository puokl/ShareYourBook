import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
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
  const collectionRef = collection(database, "books");

  const addComment = (itemId) => {
    const comment = commentInputs[itemId];
    if (comment) {
      const bookDocRef = doc(database, "books", itemId);

      // Update the document in Firebase with the new comment field
      updateDoc(bookDocRef, {
        comments: arrayUnion({
          text: comment,
          subComments: [],
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
    console.log("commentInputs", commentInputs);
    // Clear the comment input field for the specific item
    setCommentInput(itemId, "");
  };

  const addSubComment = (itemId, commentIndex) => {
    const subComment = commentInputs[`${itemId}-${commentIndex}`];
    if (subComment) {
      const updatedData = [...firebaseData];
      updatedData[itemId].comments[commentIndex].subComments.push(subComment);
      setFirebaseData(updatedData);
      setCommentInput(`${itemId}-${commentIndex}`, "");

      const bookDocRef = doc(database, "books", itemId);

      // Update the document in Firebase with the new sub-comment field
      updateDoc(bookDocRef, {
        comments: updatedData[itemId].comments,
      })
        .then(() => {
          console.log("Sub-comment added successfully!");
        })
        .catch((error) => {
          console.error("Error adding sub-comment:", error);
        });
    }
  };

  const setCommentInput = (itemId, value) => {
    setCommentInputs({ ...commentInputs, [itemId]: value });
  };

  // Fetch initial data from Firebase and listen for real-time updates
  useEffect(() => {
    const getData = () => {
      getDocs(collectionRef)
        .then((response) => {
          const data = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFirebaseData(data);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    };

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      getData();
    });

    // Unsubscribe from the snapshot listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <Flex width="60vw" bg="lightblue">
      <Text>Hello from the center</Text>
      <ul>
        {firebaseData.map((item, itemId) => (
          <li key={itemId}>
            <p>ID: {item.id}</p>
            <p>Book Name: {item.bookName}</p>
            <p>Username: {item.username}</p>
            {/* Render comments for the specific item */}
            <ul>
              {/* Iterate through comments for the specific item */}
              {item.comments &&
                item.comments.map((comment, commentIndex) => (
                  <li key={commentIndex}>
                    {comment.text}
                    {/* Render sub-comments for the specific comment */}
                    <ul>
                      {comment.subComments &&
                        comment.subComments.map(
                          (subComment, subCommentIndex) => (
                            <li key={subCommentIndex}>{subComment}</li>
                          )
                        )}
                    </ul>
                    {/* Input field for adding sub-comments */}
                    <div>
                      <input
                        type="text"
                        value={commentInputs[`${itemId}-${commentIndex}`]}
                        onChange={(e) =>
                          setCommentInput(
                            `${itemId}-${commentIndex}`,
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() => addSubComment(itemId, commentIndex)}
                      >
                        Add Sub-Comment
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            {/* Input field for adding comments */}
            <div>
              <input
                type="text"
                value={commentInputs[itemId]}
                onChange={(e) => setCommentInput(itemId, e.target.value)}
              />
              <button onClick={() => addComment(itemId)}>Add Comment</button>
            </div>
          </li>
        ))}
      </ul>
    </Flex>
  );
};
export default Center;
