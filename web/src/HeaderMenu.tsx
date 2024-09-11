import { Button, Link, Wrap, WrapItem } from "@chakra-ui/react";
import { HELP_URL, MAP_URL } from "./vars";

function HeaderMenu() {
  return (
    <Wrap justify="center">
      <WrapItem>
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#sides">
          <Button>Side Quests</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={MAP_URL}>
          <Button>Map</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={HELP_URL}>
          <Button>Help</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#leaderboard">
          <Button>Leaderboard</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#settings">
          <Button>Settings</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#faq">
          <Button>FAQ</Button>
        </Link>
      </WrapItem>
    </Wrap>
  );
}

export default HeaderMenu;
