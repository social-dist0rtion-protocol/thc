// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

interface ITreasure {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function updateRenderer(address thc, address renderer) external;

    function mint(address player, uint256 badgeId) external;

    function uri(uint256 tokenId) external view returns (string memory);
}
