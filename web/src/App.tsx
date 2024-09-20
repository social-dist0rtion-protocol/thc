import { Box, Center, VStack } from "@chakra-ui/react";
import HeaderMenu from "./HeaderMenu";
import { ReactNode } from "react";
import useIsMobile from "./hooks/useIsMobile";

type Props = {
  children: ReactNode;
};

function App({ children }: Props) {
  const isMobile = useIsMobile();
  return (
    <Center>
      <VStack width="90%">
        <HeaderMenu />
        <Box
          backgroundColor="transparent"
          marginTop="20px"
          marginBottom="60px"
          width={isMobile ? "95%" : "40%"}
        >
          {children}
        </Box>
      </VStack>
    </Center>
  );
}

export default App;
