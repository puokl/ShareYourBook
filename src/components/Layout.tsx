import Head from "next/head";
import React, { useContext } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import { Box, Flex } from "@chakra-ui/react";
import { BookContext } from "@/context/BookContext";

type LayoutProps = {
  children: any;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { bookCollection } = useContext(BookContext);
  return (
    <>
      <Head>
        <title>Share Your Book</title>
      </Head>
      <Box bg="gray.200" pb={3}>
        <Flex direction="column">
          <Navbar />
          <Box flex="1" pt="6">
            <>{children}</>
          </Box>
        </Flex>
      </Box>
      <Footer />
    </>
  );
};
export default Layout;
