import { Box, Center, Heading, Image, VStack } from "@chakra-ui/react";
import useIsMobile from "./hooks/useIsMobile";
import OfflineAlert from "./OfflineAlert";

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <OfflineAlert />
      <Center>
        <VStack width="100%">
          <Box
            textAlign="center"
            backgroundColor="transparent"
            marginTop="20px"
            marginBottom="60px"
            width={isMobile ? "95%" : "40%"}
            layerStyle="base"
          >
            <Heading>Under Construction</Heading>
            <Image src="under.png" />
          </Box>
        </VStack>
      </Center>
    </>
  );
}

export default App;
