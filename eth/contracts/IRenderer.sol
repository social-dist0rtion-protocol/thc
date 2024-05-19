// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

interface IRenderer {
    function render(uint256 id) external view returns (string memory);
}
