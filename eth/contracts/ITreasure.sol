// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ITreasure is IERC1155 {
    function hasRole(
        bytes32 role,
        address account
    ) external view returns (bool);

    function TREASURE_HUNT_ROLE() external view returns (bytes32);

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function updateRenderer(address thc, address renderer) external;

    function mint(address player, uint256 badgeId) external;

    function uri(uint256 tokenId) external view returns (string memory);
}
