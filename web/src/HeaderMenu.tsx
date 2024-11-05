import { Button, Link, Wrap, WrapItem } from "@chakra-ui/react";
import { HELP_URL, MAP_URL } from "./env";

function HeaderMenu() {
  return (
    <Wrap justify="center" marginTop="20px">
      <WrapItem>
        <Link href="/">
          <Button variant="menu">Home</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#sides">
          <Button variant="menu">Side Quests</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={MAP_URL}>
          <Button variant="menu">Map</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={HELP_URL}>
          <Button variant="menu">Help</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#leaderboard">
          <Button variant="menu">Leaderboard</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#settings">
          <Button variant="menu">Settings</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#faq">
          <Button variant="menu">FAQ</Button>
        </Link>
      </WrapItem>
    </Wrap>
  );
}

export default HeaderMenu;
