import {
  Box,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { HELP_URL } from "./env";

function FAQ() {
  return (
    <VStack gap="20px" className="content-pane" align="flex-start">
      <Heading>FAQ</Heading>
      <Box layerStyle="base">
        <Heading variant="h3">I'm stuck, can I get a hint?</Heading>
        <List>
          <ListItem>
            We made this game for people to haffun, if you need a bit of help to
            get going with your THC (Treasure Hunt Challenge){" "}
            <Link href={HELP_URL} target="_blank">
              join our Discord server
            </Link>
          </ListItem>
          <ListItem>
            Or write us on{" "}
            <Link
              href="https://x.com/dist0rtionproto"
              isExternal
              textDecoration="underline"
            >
              X
            </Link>
            , we will do our best to be responsive.
          </ListItem>
        </List>
      </Box>
      <Box layerStyle="base">
        <Heading variant="h3">What are the "side quests"</Heading>
        <Text>
          The side quests are optional puzzles. They may require specific
          technical skills. Each key in the side quest resembles a seed phrase.
          Don't expect them to be easy. Actually, we really hope all of them
          will be solved at one point, we put so much sweat 😓 on them
          (figuratively). You don't need to do them, but you earn extra points
          if you complete them.
        </Text>
      </Box>
      <Box layerStyle="base">
        <Heading variant="h3">I want to speak to the manager</Heading>
        <Text>
          is a Treasure Hunt Challenge (THC for short) created by
          <Link
            href="https://dist0rtion.com/"
            isExternal
            textDecoration="underline"
          >
            Social Dist0rtion Protocol (SDP)
          </Link>{" "}
          and{" "}
          <Link
            href="https://daedalus.industries/"
            isExternal
            textDecoration="underline"
          >
            daedalus.industries
          </Link>
          . If you feel social follow SDP on X:
          <Link
            href="https://x.com/dist0rtionproto"
            isExternal
            textDecoration="underline"
          >
            @dist0rtionporoto
          </Link>
        </Text>
      </Box>
      <Box layerStyle="base">
        <Heading variant="h3">Show me the code</Heading>
        <Text>
          The Holy Code of Treasure Hunt Creator (or THC for short) is published
          on{" "}
          <Link
            href="https://github.com/social-dist0rtion-protocol/thc"
            isExternal
            textDecoration="underline"
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
