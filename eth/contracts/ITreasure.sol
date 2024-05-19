// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ITreasure is IERC1155 {
    function mint(address player, uint256 badgeId) external;

    function hasRole(
        bytes32 role,
        address account
    ) external view returns (bool);

    function TREASURE_HUNT_ROLE() external view returns (bytes32);
}
