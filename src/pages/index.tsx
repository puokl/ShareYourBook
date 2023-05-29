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
  const { user } = useContext(AuthContext);

  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/register");
  //   }
  // }, []);
  return (
    <>
      <Layout>
        <Head>
          <title>
            ShareYourBook - Find and Share your favorite Book to the community
          </title>
          <meta
            name="description"
            content="Discover which book people likes and share your favorite books on ShareYourBook. Search for your favorite authors,
            and build your personalized reading library. Join our community of book lovers today!"
          />
          <link rel="icon" href="" />
        </Head>
        <Text>Hi {user?.displayName}</Text>
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
