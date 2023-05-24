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
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { AiOutlineHeart } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import moment from "moment";

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

const Center: React.FC<CenterProps> = () => {
  const [firebaseData, setFirebaseData] = useState([{} as FirebaseDataProps]);
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(2);
  const [showAllComments, setShowAllComments] = useState(false);
  const { username } = useContext(AuthContext);
  const toast = useToast();

  const collectionRef = collection(database, "books");

  const addComment = (itemId: string) => {
    const comment = commentInputs[itemId];
    if (comment) {
      const bookDocRef = doc(database, "books", itemId);

      // Update the document in Firebase with the new comment object
      updateDoc(bookDocRef, {
        comment: arrayUnion({
          text: comment,
          date: new Date().toISOString(),
          username: username,
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

  useEffect(() => {
    const getData = () => {
      getDocs(collectionRef)
        .then((response) => {
          const data = response.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("firebaseData", firebaseData);
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
    // const date = new Date(item.date * 1000 + item.date.nanoseconds / 1000000);
    // console.log(date);
    return unsubscribe;
  }, []);

  // const formatDate = (item) => {
  //   item.date === undefined
  //     ? console.log("time is not defined")
  //     : item.date.toLocaleDateString();
  // };

  const formattedDate = (item: string) => {
    return moment(item).fromNow();
  };

  const handleShowMore = () => {
    setVisibleComments(visibleComments + 5);
  };

  const handleShowLess = () => {
    setVisibleComments(Math.max(visibleComments - 5, 2));
  };

  return (
    <Flex width="60vw" bg="lightblue" direction="column">
      <Text>What other people think of these books</Text>
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" height="50vh">
          <Spinner />
        </Flex>
      ) : (
        //SECTION - BOOKS
        <Flex direction="column">
          {firebaseData?.map((item, index) => (
            <Flex key={index} direction="column">
              {console.log("formattedDate", formattedDate(item.date))}
              <Flex justifyContent="space-around" direction="column">
                <Flex>
                  <Flex direction="column" ml="20px">
                    <Flex>
                      <Image
                        src="./images/avatar.jpeg"
                        boxSize="25px"
                        borderRadius="40%"
                      />

                      <Text fontSize="sm" as="b" ml="20px">
                        {item.username}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" as="b">
                      {item.bookName}
                    </Text>

                    <Text fontSize="xs">
                      by:{" "}
                      <Text fontSize="sm" as="b">
                        {item.authorName}
                      </Text>
                    </Text>
                    {/* <Text fontSize="xs">
                      User:{" "}
                      <Text fontSize="sm" as="b">
                        {item.username}
                      </Text>
                    </Text> */}
                    <Text fontSize="xs">
                      Posted on:{" "}
                      <Text fontSize="sm" as="b">
                        {formattedDate(item.date)}
                      </Text>
                    </Text>
                  </Flex>
                  <Flex width="auto" height="65px">
                    <Image
                      // boxSize="50px"
                      layout="fill"
                      objectFit="contain"
                      src={item.cover}
                      alt="book cover"
                      fallbackSrc=""
                      ml="100px"
                    />
                  </Flex>
                </Flex>
                <Flex>
                  <HStack>
                    <Text>
                      {item.comment ? item.comment.length : 0} comments
                    </Text>
                    <GoComment />
                  </HStack>
                  <HStack ml="50px">
                    <AiOutlineHeart />
                    <Text>Likes</Text>
                  </HStack>
                  {/* {console.log("item", item.comment.length)} */}
                  {/* <Text>
                    like <AiOutlineHeart /> and comment <GoComment />
                  </Text> */}
                </Flex>
              </Flex>

              {/* <Flex direction="column">
                {item.comment &&
                  item.comment.map((comment, commentIndex) => (
                    <Flex
                      key={commentIndex}
                      // direction="column"
                      justifyContent="center"
                      // alignContent="flex-end"
                    >
                      <Flex justifyContent="space-around" width="400px">
                        <Image
                          src="./images/avatar.jpeg"
                          boxSize="25px"
                          borderRadius="40%"
                        />
                        <Flex direction="column" ml="10px" width="350px">
                          <Text fontSize="xs" as="samp">
                            {comment.username}
                          </Text>

                          <Text fontSize="sm" as="cite">
                            "{comment.text}"
                          </Text>
                        </Flex>
                      </Flex>

                      <Text fontSize="xs" as="samp">
                        {formattedDate(comment.date)}
                      </Text>

                      <Button
                        size="sx"
                        width="100px"
                        onClick={() => deleteComment(item.id, commentIndex)}
                      >
                        Delete
                      </Button>
                      {item.comment &&
                        item.comment.length > visibleComments && (
                          <Flex justifyContent="center">
                            {showAllComments ? (
                              <Button
                                size="sx"
                                onClick={() => setShowAllComments(false)}
                              >
                                Show Less
                              </Button>
                            ) : (
                              <Button
                                size="sx"
                                onClick={() => setShowAllComments(true)}
                              >
                                Show More
                              </Button>
                            )}
                          </Flex>
                        )}
                    </Flex>
                  ))}
              </Flex> */}

              <Flex direction="column">
                {item.comment &&
                  item.comment
                    .slice(0, visibleComments)
                    .map((comment, commentIndex) => (
                      <Flex key={commentIndex} justifyContent="center">
                        <Flex justifyContent="space-around" width="400px">
                          <Image
                            src="./images/avatar.jpeg"
                            boxSize="25px"
                            borderRadius="40%"
                          />
                          <Flex direction="column" ml="10px" width="350px">
                            <Text fontSize="xs" as="samp">
                              {comment.username}
                            </Text>

                            <Text fontSize="sm" as="cite">
                              "{comment.text}"
                            </Text>
                          </Flex>
                        </Flex>

                        <Text fontSize="xs" as="samp">
                          {formattedDate(comment.date)}
                        </Text>

                        <Button
                          size="sx"
                          width="100px"
                          onClick={() => deleteComment(item.id, commentIndex)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    ))}

                {item.comment && item.comment.length > visibleComments && (
                  <Flex justifyContent="center">
                    <Button size="sx" onClick={handleShowMore}>
                      Show More
                    </Button>
                  </Flex>
                )}

                {visibleComments > 2 && (
                  <Flex justifyContent="center">
                    <Button size="sx" onClick={handleShowLess}>
                      Show Less
                    </Button>
                  </Flex>
                )}
              </Flex>
              <Flex>
                <Input
                  type="text"
                  value={commentInputs[item.id] || ""}
                  onChange={(e) => setCommentInput(item.id, e.target.value)}
                />
                <Button onClick={() => addComment(item.id)}>Add Comment</Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
export default Center;
