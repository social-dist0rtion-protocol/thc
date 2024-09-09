import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./index.css";
import { ConnectKitProvider } from "connectkit";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.jsx";
import Settings from "./Settings.tsx";

const theme = extendTheme({
  styles: {
    global: {
      html: {
        background: "black",
      },
    },
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
    path: "/chapter/:number",
    element: <Home />,
  },
  {
    path: "/sidequest/:number",
    element: <Home />,
  },
  {
    path: "/leaderboard",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/map",
    element: <Home />,
  },
  {
    path: "/help",
    element: <Home />,
  },
  {
    path: "/about",
    element: <Home />,
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
