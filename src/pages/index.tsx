import React, { useContext, useEffect, useState } from "react";
import { app } from "../firebase/firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Flex, Text } from "@chakra-ui/react";
import { AuthContext } from "@/context/AuthContext";
import Left from "@/components/leftBody/Left";
import Center from "@/components/centerBody/Center";
import Right from "@/components/rightBody/Right";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const logout = () => {
    sessionStorage.removeItem("Token");
    router.push("/register");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    const user = sessionStorage.getItem("user");

    if (!token) {
      router.push("/register");
    } else {
      setUsername(user ?? "");
    }
  }, []);
  return (
    <>
      <Layout>
        <Head>
          <title>Home</title>
          <meta name="description" content="" />
          <link rel="icon" href="" />
        </Head>
        <Text>Hi {username}</Text>
        <Flex height="80vh">
          <Left />
          <Center />
          <Right />
        </Flex>
      </Layout>
    </>
  );
};
export default index;
