import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

export const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  colors: {
    brand: {
      100: "#ff3c00",
    },
  },
  fonts: { body: "Open Sans, sans-serif" },
  styles: {
    global: () => {
      body: {
        bg: "gray.200";
      }
    },
  },
  components: {
    Input: {
      baseStyle: {},
    },
  },
});
