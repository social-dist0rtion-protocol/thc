import { Box, Center, VStack } from "@chakra-ui/react";
import HeaderMenu from "./HeaderMenu";
import useIsMobile from "./hooks/useIsMobile";
import { Outlet } from "react-router-dom";
import OfflineAlert from "./OfflineAlert";

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <OfflineAlert />
      <Center>
        <VStack width="100%">
          <HeaderMenu />
          <Box
            backgroundColor="transparent"
            marginTop="20px"
            marginBottom="60px"
            width={isMobile ? "95%" : "40%"}
            layerStyle="base"
          >
            <Outlet />
          </Box>
        </VStack>
      </Center>
    </>
  );
}

export default App;
