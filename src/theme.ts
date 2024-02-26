import { extendTheme } from "@chakra-ui/react";
import '@fontsource/poppins';

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  initialColorMode: "light",
  useSystemColorMode: false,
});

export default theme;
