import { Button, Wrap, WrapItem } from "@chakra-ui/react";
import { HELP_URL, MAP_URL } from "./env";
import { Link } from "react-router-dom";

function HeaderMenu() {
  return (
    <Wrap justify="center" marginTop="20px">
      <WrapItem>
        <Link to="/">
          <Button variant="menu">Home</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to="/sides">
          <Button variant="menu">Side Quests</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to={MAP_URL} target="_blank">
          <Button variant="menu">Map</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to={HELP_URL} target="_blank">
          <Button variant="menu">Help</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to="/leaderboard">
          <Button variant="menu">Leaderboard</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to="/settings">
          <Button variant="menu">Settings</Button>
        </Link>
      </WrapItem>
      <WrapItem>
        <Link to="/faq">
          <Button variant="menu">FAQ</Button>
        </Link>
      </WrapItem>
    </Wrap>
  );
}

export default HeaderMenu;
