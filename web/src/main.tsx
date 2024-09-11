import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import "./index.css";
import { ConnectKitProvider } from "connectkit";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.tsx";
import Leaderboard from "./Leaderboard.tsx";
import Settings from "./Settings.tsx";
import FAQ from "./FAQ.tsx";
import SideQuests from "./SideQuests.tsx";

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    textTransform: "uppercase",
  },
});

const Heading = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    textTransform: "uppercase",
  },
  variants: {
    h1: (props) => ({
      fontSize: "2em",
    }),
    h2: (props) => ({
      fontSize: "1.5em",
      marginBottom: "10px",
    }),
  },
  defaultProps: {
    variant: "h1",
  },
});

const theme = extendTheme({
  styles: {
    global: {
      html: {},
    },
  },
  components: {
    Button,
    Heading,
  },
});

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/sides",
    element: <SideQuests />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ConnectKitProvider>
            <App>
              <RouterProvider router={router} />
            </App>
          </ConnectKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
