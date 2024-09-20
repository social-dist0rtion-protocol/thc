import { defineStyle, defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import "./fonts.css";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    textTransform: "uppercase",
    width: "100%",
  },
  variants: {
    main: {
      background: "rgba(230, 91, 84, 0.666)",
      color: "white",
      borderRadius: "0px",
      transition: "all 0.5s",
      _hover: {
        background: "rgba(230, 91, 84, 1)",
      },
      _disabled: {
        color: "rgb(148, 148, 148)",
        background: "#7a7a7a",
        cursor: "not-allowed",
      },
    },
    menu: {
      fontFamily: "OCR",
      background: "rgba(230, 91, 84, 0.666)",
      color: "black",
      borderRadius: "full",
      fontSize: "0.8em",
      transition: "all 0.5s",
      fontWeight: "bold",
      height: "30px",
    },
  },
  defaultProps: {
    variant: "main",
  },
});

const Input = defineMultiStyleConfig({
  sizes: {
    md: definePartsStyle({
      field: defineStyle({
        borderRadius: "none",
      }),
    }),
  },
});

const Textarea = defineStyleConfig({
  // The styles all button have in common

  variants: {
    base: {
      borderRadius: "0px",
      background: "rgba(255, 255, 255, 0.666)",
    },
  },
  defaultProps: {
    variant: "base",
  },
});

const Heading = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontFamily: "OCR",
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  variants: {
    h1: (_) => ({
      fontSize: "2em",
    }),
    h2: (_) => ({
      fontSize: "1.5em",
      marginBottom: "10px",
    }),
    h3: (_) => ({
      fontSize: "1.2em",
      marginBottom: "10px",
    }),
  },
  defaultProps: {
    variant: "h1",
  },
});

export const theme = extendTheme({
  fonts: {
    heading: `"Roboto", "Arial", "serif"`,
    body: `"Roboto", "Arial", "serif"`,
  },
  styles: {
    global: {
      html: {
        background: "url(./images/bg.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
      },
      body: {
        background: "transparent",
      },
    },
  },
  layerStyles: {
    base: {
      background: "rgba(255, 255, 255, 0.666)",
      padding: "10px",
    },
  },
  components: {
    Button,
    Heading,
    Input,
    Textarea,
  },
});
