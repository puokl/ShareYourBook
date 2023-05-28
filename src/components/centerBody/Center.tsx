import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Flex,
  Text,
  useToast,
  Spinner,
  VStack,
  Image,
  AspectRatio,
  Input,
  HStack,
} from "@chakra-ui/react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { AiOutlineHeart } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import moment from "moment";
import Comment from "./Comments";
import Book from "./Books";

type CenterProps = {};
interface FirebaseDataProps {
  bookName: string;
  comment: string[];
  cover: string;
  date: string;
  id: string;
  unsername: string;
  authorName: string;
}
type User = {
  email: string;
  photoURL: string;
  username: string;
};
const Center: React.FC<CenterProps> = ({ items }) => {
  const [firebaseData, setFirebaseData] = useState([{} as FirebaseDataProps]);
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [showAllComments, setShowAllComments] = useState(false);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [userimg, setUserimg] = useState([]);
  const [userAvatar, setUserAvatar] = useState<User[]>([]);

  const addComment = (itemId: string) => {
    const comment = commentInputs[itemId];
    if (comment) {
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

  const formattedDate = (item: string) => {
    return moment(item).fromNow();
  };

  // const handleShowMore = () => {
  //   setVisibleComments(visibleComments + 5);
  // };

  // const handleShowLess = () => {
  //   setVisibleComments(Math.max(visibleComments - 5, 2));
  // };

  const handleLikeClick = (item) => {
    const booksDocRef = doc(database, "books", item.id);

    updateDoc(booksDocRef, {
      like: arrayUnion(user.uid),
    })
      .then(() => console.log("res"))
      .catch((err) => {
        alert(err.message);
        console.log("err.message", err.message);
      });
  };

  const booksCollectionRef = collection(database, "books");
  const usersCollectionRef = collection(database, "user");
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await getDocs(booksCollectionRef);
        const data = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("firebaseData", firebaseData);
        setFirebaseData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      }
    };

    const unsubscribe = onSnapshot(booksCollectionRef, (snapshot) => {
      fetchBookData();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const snapshot = await getDocs(usersCollectionRef);
        const userData = snapshot.docs.map((doc) => doc.data() as User);
        console.log("userData", userData);
        setUserAvatar(userData);
        console.log("userAvatar", userAvatar);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    const unsubscribe = onSnapshot(usersCollectionRef, () => {
      fetchUserData();
    });

    return unsubscribe;
  }, []);

  //!SECTION

  //ANCHOR -

  const getImg = (item) =>
    getDoc(doc(database, "user", item.email)).then(
      (res) => res.data().photoURL
    );

  //!SECTION
  return (
    <Flex minHeight="90vh" width="65vw" bg="gray.200" direction="column">
      <Text>What other people think of these books</Text>
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="50vh">
          <Spinner />
        </Flex>
      ) : (
        //SECTION - BOOKS
        <Flex direction="column">
          {firebaseData &&
            firebaseData?.map((item, index) => {
              const { email } = item;
              const user = userAvatar.find((user) => user.email === email);
              const photoURL = user ? user.photoURL : null;
              console.log("photoURL", photoURL);

              return (
                <Book
                  item={item}
                  userAvatar={userAvatar}
                  handleLikeClick={handleLikeClick}
                  visibleComments
                  handleShowMore
                  handleShowLess
                  commentInputs={commentInputs}
                  setCommentInput={setCommentInput}
                  addComment={addComment}
                  deleteComment={deleteComment}
                />
                // <Flex key={index} direction="column">
                //   <Flex justifyContent="space-around" direction="column">
                //     <Flex>
                //       <Flex direction="column" ml="20px">
                //         <Flex>
                //           <Image
                //             // src="./images/avatar.jpeg"
                //             src={photoURL}
                //             boxSize="25px"
                //             borderRadius="40%"
                //           />

                //           <Text fontSize="sm" as="b" ml="20px">
                //             {item.username}
                //           </Text>
                //         </Flex>
                //         <Text fontSize="sm" as="b">
                //           {item.bookName}
                //         </Text>

                //         <Text fontSize="xs">
                //           by:{" "}
                //           <Text fontSize="sm" as="b">
                //             {item.authorName}
                //           </Text>
                //         </Text>

                //         <Text fontSize="xs">
                //           posted:{" "}
                //           <Text fontSize="sm" as="b">
                //             {formattedDate(item.date)}
                //           </Text>
                //         </Text>
                //       </Flex>
                //       <Flex width="auto" height="65px">
                //         <Image
                //           // boxSize="50px"
                //           layout="fill"
                //           objectFit="contain"
                //           src={item.cover}
                //           alt="book cover"
                //           fallbackSrc=""
                //           ml="100px"
                //         />
                //       </Flex>
                //     </Flex>
                //     <Flex>
                //       <HStack>
                //         <Text>
                //           {item.comment ? item.comment.length : 0} comments
                //         </Text>
                //         <GoComment />
                //       </HStack>
                //       <HStack ml="50px">
                //         <button onClick={() => handleLikeClick(item)}>
                //           <AiOutlineHeart />
                //         </button>
                //         <Text>
                //           {item.like ? item.like.length : 0}{" "}
                //           {item.like.length == 1 ? "like" : "likes"}
                //         </Text>
                //       </HStack>
                //     </Flex>
                //   </Flex>

                //   {/* //SECTION - COMMENTS  */}
                //   <Flex direction="column">
                //     {item.comment &&
                //       item.comment
                //         .slice(0, visibleComments)
                //         .map((comment, commentIndex) => {
                //           const commentUser = userAvatar.find(
                //             (user) => user.username === comment.username
                //           );
                //           const commentUserPhotoURL = commentUser
                //             ? commentUser.photoURL
                //             : null;
                //           return (
                //             <Comment
                //               key={commentIndex}
                //               comment={comment}
                //               commentIndex={commentIndex}
                //               commentUserPhotoURL={commentUserPhotoURL}
                //               deleteComment={(commentIndex) =>
                //                 deleteComment(item.id, commentIndex)
                //               }
                //             />
                //           );
                //         })}
                //     {item.comment && item.comment.length > visibleComments && (
                //       <Flex justifyContent="center">
                //         <Button size="sx" onClick={handleShowMore}>
                //           Show More
                //         </Button>
                //       </Flex>
                //     )}

                //     {visibleComments > 2 && (
                //       <Flex justifyContent="center">
                //         <Button size="sx" onClick={handleShowLess}>
                //           Show Less
                //         </Button>
                //       </Flex>
                //     )}
                //   </Flex>
                //   <Flex bg="white">
                //     <Input
                //       type="text"
                //       value={commentInputs[item.id] || ""}
                //       onChange={(e) => setCommentInput(item.id, e.target.value)}
                //     />
                //     <Button onClick={() => addComment(item.id)}>
                //       Add Comment
                //     </Button>
                //   </Flex>
                // </Flex>
              );
            })}
        </Flex>
      )}
    </Flex>
  );
};

export default Center;

//   <Flex
//     key={commentIndex}
//     justifyContent="center"
//     bg="red.100"
//   >
//     <Flex width="150px" direction="column">
//       <Image
//         src="./images/avatar.jpeg"
//         boxSize="25px"
//         borderRadius="40%"
//       />
//     </Flex>
//     <Flex direction="column">
//       <Flex
//         ml="10px"
//         width="350px"
//         justifyContent="space-between"
//       >
//         <Flex>
//           <Text fontSize="sm" as="b" color="blue.600">
//             {comment.username}
//           </Text>{" "}
//           <Text
//             fontSize="10px"
//             as="samp"
//             ml="10px"
//             mt="2px"
//           >
//             {formattedDate(comment.date)}
//           </Text>
//         </Flex>
//         <Flex>
//           <Button
//             size="sx"
//             width="100px"
//             onClick={() => deleteComment(commentIndex)}
//           >
//             Delete
//           </Button>
//         </Flex>
//       </Flex>
//       <Flex>
//         <Text fontSize="sm" as="cite">
//           "{comment.text}"
//         </Text>
//       </Flex>
//     </Flex>
//   </Flex>
//   // <Comment
//   //   key={commentIndex}
//   //   comment={comment}
//   //   commentIndex={commentIndex}
//   //   deleteComment={(commentIndex) =>
//   //     deleteComment(item.id, commentIndex)
//   //   }
//   // />
// ))}

//   {item.comment && item.comment.length > visibleComments && (
//     <Flex justifyContent="center">
//       <Button size="sx" onClick={handleShowMore}>
//         Show More
//       </Button>
//     </Flex>
//   )}

//   {visibleComments > 2 && (
//     <Flex justifyContent="center">
//       <Button size="sx" onClick={handleShowLess}>
//         Show Less
//       </Button>
//     </Flex>
//   )}
// </Flex>
// <Flex bg="white">
//   <Input
//     type="text"
//     value={commentInputs[item.id] || ""}
//     onChange={(e) => setCommentInput(item.id, e.target.value)}
//   />
//   <Button onClick={() => addComment(item.id)}>
//     Add Comment
//   </Button>
