// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "./IRenderer.sol";

contract Treasure is
    OwnableUpgradeable,
    AccessControlUpgradeable,
    ERC1155Upgradeable
{
    bytes32 public constant TREASURE_HUNT_ROLE =
        keccak256("TREASURE_HUNT_ROLE");

    mapping(address => IRenderer) public renderers;

    function initialize() public initializer {
        __Ownable_init();
        __ERC1155_init("");
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
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
            renderers[address(uint160(tokenId >> 96))].render(uint96(tokenId));
    }
}
