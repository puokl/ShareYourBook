import "@/styles/globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { BookContextProvider } from "@/context/BookContext";
import { UserContextProvider } from "@/context/UserContext";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <UserContextProvider>
          <BookContextProvider>
            <Component {...pageProps} />
          </BookContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  );
}
