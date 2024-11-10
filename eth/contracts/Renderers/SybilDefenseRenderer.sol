// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

interface EtovassRenderer {
    function renderSVG(
        uint tokenId,
        uint seed
    ) external view returns (string memory);
}

contract SybilDefenseRenderer is Ownable {
    EtovassRenderer internal _etovassRenderer =
        EtovassRenderer(0x933a92a5032BB84f5B12F005a8560cd272BC9d45);

    string[5] names = ["Gold", "Silver", "Bronze", "Finisher", "Investigator"];
    string[5] positions = ["1st", "2nd", "3rd", "Nth", "-"];

    constructor() {}

    function setEtovassRenderer(EtovassRenderer renderer) public onlyOwner {
        _etovassRenderer = renderer;
    }

    function render(uint256 id) external view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"Sybil Defense - ',
                            names[id - 1],
                            '", "description":"Commendetations for the Treasure Hunt **Sybil Defense**, run at Devcon7, Bangkok. Kindly created by Eto Vass, follow him at https://twitter.com/EtoVass"',
                            ',"image":"data:image/svg+xml;base64,',
                            Base64.encode(
                                abi.encodePacked(
                                    _etovassRenderer.renderSVG(
                                        id - 1,
                                        block.timestamp / (1 days)
                                    )
                                )
                            ),
                            '","attributes":',
                            '[{"trait_type":"Position","value":"',
                            positions[id - 1],
                            '"},{"trait_type":"Treasure Hunt","value":"Sybil Defense"},{"trait_type":"Host","value":"Devcon7"},{"trait_type":"Location","value":"Bangkok"},{"trait_type":"Artist","value":"Eto Vass"}]}'
                        )
                    )
                )
            );
    }
}
