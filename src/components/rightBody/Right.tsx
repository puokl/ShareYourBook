import React, { useContext } from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";
import { UserType } from "@/types/userType";
import { capitalizeWords, formatFirebaseDate } from "@/utils/utils";
import { AuthContext } from "@/context/AuthContext";
import { User as FirebaseUser } from "firebase/auth";

const Right: React.FC = () => {
  const auth = getAuth();
  const [userData, setUserData] = useState<UserType[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(database, "user");
        const querySnapshot = await getDocs(usersCollectionRef);

        const fetchedUserData: UserType[] = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          fetchedUserData.push(user as UserType);
        });

        setUserData(fetchedUserData);
        console.log("userData", userData);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);
  return (
    <>
      {" "}
      {user && (
        <Flex mt={15}>
          <Box>
            <Text fontSize={13} m={4}>
              Total users:{" "}
              <Text as="b" ml={1} fontSize={12}>
                {userData.length}
              </Text>
            </Text>
            {userData.map((user) => (
              <Flex
                m={2}
                ml={5}
                key={user.email}
                direction="column"
                alignItems="flex-start"
              >
                <Flex>
                  <Avatar
                    size={"xs"}
                    src={user.photoURL}
                    name={user ? user?.username : ""}
                  />
                  <Text fontSize="sm" ml={2} as="b">
                    {capitalizeWords(user.username)}
                  </Text>
                </Flex>
                <Flex mt={0.5}>
                  <Text fontSize="xs">
                    Last seen:{" "}
                    {formatFirebaseDate(
                      user?.lastLoginDate
                        ? user.lastLoginDate
                        : user.firstLoginDate
                    )}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Box>
        </Flex>
      )}
    </>
  );
};
export default Right;
