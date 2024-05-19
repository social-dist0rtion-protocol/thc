// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./IRenderer.sol";
import "hardhat/console.sol";

contract Treasure is Ownable, AccessControl, ERC1155 {
    bytes32 public constant TREASURE_HUNT_ROLE =
        keccak256("TREASURE_HUNT_ROLE");

    mapping(address => IRenderer) public renderers;

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function updateRenderer(address thc, address renderer) external onlyOwner {
        renderers[thc] = IRenderer(renderer);
    }

    function mint(
        address player,
        uint256 badgeId
    ) public onlyRole(TREASURE_HUNT_ROLE) {
        super._mint(
            player,
            (uint256(uint160(_msgSender())) << 96) | badgeId,
            1,
            ""
        );
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return
            string(
                renderers[address(uint160(tokenId >> 96))].render(
                    uint96(tokenId)
                )
            );
    }
}
