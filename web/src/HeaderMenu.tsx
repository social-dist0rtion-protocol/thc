import { Button, Link, Wrap, WrapItem } from "@chakra-ui/react";

function HeaderMenu() {
  return (
    <Wrap>
      <WrapItem>
        <Button>
          <Link href="/"> Home</Link>
        </Button>
      </WrapItem>
      <WrapItem>
        <Button>
          <Link href="/#settings">Settings</Link>
        </Button>
      </WrapItem>
      <WrapItem>
        <Button>Menu 3</Button>
      </WrapItem>
      <WrapItem>
        <Button>Menu 4</Button>
      </WrapItem>
      <WrapItem>
        <Button>Menu 5</Button>
      </WrapItem>
    </Wrap>
  );
}

export default HeaderMenu;
