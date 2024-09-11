import {
  Box,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { APP_NAME } from "./vars";

function FAQ() {
  return (
    <VStack gap="20px" className="content-pane" align="flex-start">
      <Heading>FAQ</Heading>
      <Box>
        <Heading variant="h2">I'm stuck, can I get a hint?</Heading>
        <List>
          <ListItem>
            We made this game for people to haffun, if you need a bit of help to
            get going with your THC (Treasure Hunt Challenge) join our Matrix
            channel, or visit us at, we are in the third floor (check the map!).
          </ListItem>
          <ListItem>
            Or write us on twitter, we will do our best to be responsive.
          </ListItem>
        </List>
      </Box>
      <Box>
        <Heading variant="h2">What are the "side quests"</Heading>
        <Text>
          The side quests are optional puzzles. All documents start with the
          hashtag symbol #. They may require specific technical skills. Don't
          expect them to be easy. Actually, we really hope all of them will be
          solved at one point, we put so much sweat 😓 on them (figuratively).
          You don't need to do them, but you earn extra points if you complete
          them.
        </Text>
      </Box>
      <Box>
        <Heading variant="h2">I want to speak to the manager</Heading>
        <Text>
          {APP_NAME} is a Treasure Hunt Challenge (THC for short) created by
          <Link href="https://dist0rtion.com" isExternal>
            Social Dist0rtion Protocol
          </Link>
          . We do this for the clout so don't forget to follow on
          tweeeeetererer:{" "}
          <Link href="https://dist0rtion.com/dist0rtionproto" isExternal>
            @dist0rtionporoto
          </Link>
        </Text>
      </Box>
      <Box>
        <Heading variant="h2">Show me the code</Heading>
        <Text>
          The Holy Code of Treasure Hunt Creator (or THC for short) is published
          on{" "}
          <Link
            href="https://github.com/social-dist0rtion-protocol/thc"
            isExternal
          >
            GitHub
          </Link>
          .
        </Text>
      </Box>
    </VStack>
  );
}

export default FAQ;
