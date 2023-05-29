import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";

type RightProps = {};

const Right: React.FC<RightProps> = () => {
  const auth = getAuth();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(database, "user");
        const querySnapshot = await getDocs(usersCollectionRef);

        const fetchedUserData = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          fetchedUserData.push(user);
        });

        setUserData(fetchedUserData);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);
  return (
    <Flex
      width="20vw"
      bg="lightgrey
  "
      //   height="80"
    >
      <Text>Hi there</Text>

      <Flex>
        <ul>
          {userData.map((user) => (
            <Flex>
              {console.log("user inside", user)}
              <Text key={user.email}>
                <img src={user.photoURL} alt="User Profile" />
                <p>Username: {user.username}</p>
                {/* <p>Last Login Date: {user.lastLoginDate}</p> */}
              </Text>
            </Flex>
          ))}
        </ul>
      </Flex>
    </Flex>
  );
};
export default Right;
