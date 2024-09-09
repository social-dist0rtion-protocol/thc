import { Button } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";

function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button onClick={show} variant="primary">
            {isConnected ? (ensName ?? truncatedAddress) : "connect"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export default ConnectButton;
