import { Box, Spinner } from "@chakra-ui/react";

const CenteredSpinner = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="100%"
    height="100%"
    minHeight="200px" // Adjust the min height as needed
  >
    <Spinner size="xl" />
  </Box>
);

export default CenteredSpinner;
