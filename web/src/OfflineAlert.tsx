import { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";

const OfflineAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Alert
      status="error"
      flexDirection={{ base: "column", md: "row" }} // Column on mobile, row on larger screens
      alignItems="flex-start"
      textAlign="left"
    >
      <Box>
        <AlertTitle>
          <AlertIcon /> You're offline!
        </AlertTitle>
        <AlertDescription>
          Some features may not be available until you're back online.
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default OfflineAlert;
