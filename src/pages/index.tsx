import React, { useContext, useEffect, useState } from "react";
import { app } from "../firebase/firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Box, Divider, Flex, Text, Stack } from "@chakra-ui/react";
import { AuthContext } from "@/context/AuthContext";
import Left from "@/components/leftBody/Left";
import Center from "@/components/centerBody/Center";
import Right from "@/components/rightBody/Right";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  return (
    <>
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

      <Layout>
        <Box>
          <Flex>
            <Box width={{ base: "17%", md: "15%" }}>
              <Left />
            </Box>
            <Stack
              width={{ base: "88%", md: "68%" }}
              minHeight="75vh"
              direction="row"
            >
              {/* <Divider orientation="vertical" borderColor="black" /> */}
              <Center />
              {/* <Divider orientation="vertical" borderColor="black" /> */}
            </Stack>
            <Box
              display={{ base: "none", md: "block" }}
              width={{ base: "0%", md: "17%" }}
            >
              <Right />
            </Box>
          </Flex>
        </Box>
      </Layout>
    </>
  );
};
export default index;
