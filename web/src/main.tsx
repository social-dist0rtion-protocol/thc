import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import { ConnectKitProvider } from "connectkit";
import { createHashRouter, RouterProvider } from "react-router-dom";
import LeaderboardComponent from "./Leaderboard.tsx";
import Settings from "./Settings.tsx";
import FAQ from "./FAQ.tsx";
import SideQuest from "./SideQuest.tsx";
import Quest from "./Quest.tsx";
import { theme } from "./theme/theme.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Quest />,
      },
      {
        path: "/leaderboard",
        element: <LeaderboardComponent />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/sides",
        element: <SideQuest />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ConnectKitProvider>
            <RouterProvider router={router} />
          </ConnectKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
