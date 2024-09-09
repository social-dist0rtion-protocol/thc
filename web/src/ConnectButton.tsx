import { Button } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";

function ConnectButton({ label }: { label: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button onClick={show} variant="primary">
            {label}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export default ConnectButton;
