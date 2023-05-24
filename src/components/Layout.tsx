import Head from "next/head";
import React from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

type LayoutProps = {
  children: any;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Book API</title>
      </Head>
      <Navbar />
      <>{children}</>
      <Footer />
    </>
  );
};
export default Layout;
