import { AuthContextProvider } from "@/context/AuthContext";
import { BookContextProvider } from "@/context/BookContext";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "../chakra/theme";
import { UserContextProvider } from "@/context/UserContext";

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
