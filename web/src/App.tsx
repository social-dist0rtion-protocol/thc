import { Center, VStack } from "@chakra-ui/react";
import HeaderMenu from "./HeaderMenu";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function App({ children }: Props) {
  return (
    <Center>
      <VStack width="90%">
        <HeaderMenu />
        {children}
      </VStack>
    </Center>
  );
}

export default App;
