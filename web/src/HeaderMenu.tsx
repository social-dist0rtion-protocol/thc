import { Button, Link, Wrap, WrapItem } from "@chakra-ui/react";
import { HELP_URL, MAP_URL } from "./env";

function HeaderMenu() {
  return (
    <Wrap justify="center">
      <WrapItem>
        <Link href="/">
          <Button variant="menu">
            {"<<"}H{"<"}ome
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#sides">
          <Button variant="menu">
            {"<<"}S{"<"}ide Quests
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={MAP_URL}>
          <Button variant="menu">
            {"<<"}M{"<"}ap
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href={HELP_URL}>
          <Button variant="menu">
            {"<<"}H{"<"}elp
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#leaderboard">
          <Button variant="menu">
            {"<<"}L{"<"}eaderboard
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#settings">
          <Button variant="menu">
            {"<<"}S{"<"}ettings
          </Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link href="/#faq">
          <Button variant="menu">
            {"<<"}F{"<"}AQ
          </Button>
        </Link>
      </WrapItem>
    </Wrap>
  );
}

export default HeaderMenu;
