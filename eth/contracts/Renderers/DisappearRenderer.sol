// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DisappearRenderer is Ownable {
    constructor() {}

    string constant template0 =
        "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' style='background: black'>";
    string constant template1 =
        "<g> <circle cx='300' cy='180' r='100' fill='red' /> <circle cx='265' cy='155' r='15' fill='black' /> <circle cx='335' cy='155' r='15' fill='black' /> <path stroke='black' d='M 250 210 C 275 240, 325 240, 350 210' stroke-width='13' stroke-linecap='round' fill='transparent' />";
    string constant template2 = "</g></svg>";
    string constant drop0 =
        "<path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='";
    string constant drop1 = "'> <animate attributeName='stroke' values='red;";
    string constant drop2 = ";red;' dur='2s' begin='";
    string constant drop3 = "s' repeatCount='indefinite' /> </path>";

    string[] transforms = [
        "",
        "scale(0.95) translate(16, 3)",
        "scale(0.90) translate(33, 6)",
        "scale(0.85) translate(53, 9)",
        "scale(0.80) translate(75, 13)",
        "scale(0.75) translate(100, 17)",
        "scale(0.70) translate(128, 22)",
        "scale(0.65) translate(161, 27)",
        "scale(0.60) translate(200, 34)",
        "scale(0.55) translate(244, 42)",
        "scale(0.50) translate(300, 51)",
        "scale(0.45) translate(366, 63)",
        "scale(0.40) translate(451, 77)",
        "scale(0.35) translate(558, 96)",
        "scale(0.30) translate(700, 122)",
        "scale(0.25) translate(897, 158)",
        "scale(0.20) translate(1200, 212)",
        "scale(0.15) translate(1700, 300)",
        "scale(0.10) translate(2701, 490)",
        "scale(0.05) translate(5701, 1040)"
    ];
    string constant stroboEyes =
        "<circle cx='265' cy='155' r='19' fill='#ffffff'> <animate attributeName='opacity' values='0;0;0;0;1;0;1;0;0' dur='0.8s' repeatCount='indefinite' /> </circle> <circle cx='265' cy='155' r='13' fill='#ffffff'> <animate attributeName='opacity' values='0;0;1;0;0;0;1;0;0' dur='0.3s' repeatCount='indefinite' /> </circle> <circle cx='335' cy='155' r='19' fill='#ffffff'> <animate attributeName='opacity' values='0;0;0;0;1;0;1;0;0' dur='0.2s' repeatCount='indefinite' /> </circle>";
    string constant eyeBags =
        "<path d='M 250 170 c 7 7, 20 7, 30 0' stroke-linejoin='round' stroke-linecap='round' fill='transparent' stroke='black' stroke-width='2px' /> <path d='M 320 170 c 6 7, 25 7, 30 0' stroke-linejoin='round' stroke-linecap='round' fill='transparent' stroke='black' stroke-width='2px' />";

    string[5] names = ["Gold", "Silver", "Bronze", "Finisher", "Investigator"];
    string[5] positions = ["1st", "2nd", "3rd", "Nth", "-"];
    string[5] colors = ["yellow", "silver", "525F48", "red", "red"];

    uint256 constant OFFSET = 1 hours; // Berlin is UTC+1

    function isDaytime() public view returns (bool) {
        uint berlinTime = block.timestamp + uint(int(OFFSET));
        uint hour = (berlinTime / 3600) % 24;
        if (hour >= 6 && hour < 23) {
            return true; // Daytime
        } else {
            return false; // Nighttime
        }
    }

    function _renderDrop(
        uint256 badgeId
    ) internal view returns (bytes memory rendering) {
        uint256 length = transforms.length;
        for (uint256 i = 0; i < length; i++) {
            rendering = abi.encodePacked(
                rendering,
                drop0,
                transforms[i],
                drop1,
                colors[badgeId - 1],
                drop2,
                i > 9 ? "1." : "0.",
                Strings.toString(i % 10),
                drop3
            );
        }
    }

    function svg(uint256 id) internal view returns (bytes memory) {
        string memory bags = isDaytime() ? "" : eyeBags;
        string memory strobo = id == 5 ? stroboEyes : "";

        return
            abi.encodePacked(
                template0,
                _renderDrop(id),
                template1,
                strobo,
                bags,
                template2
            );
    }

    function render(uint256 id) external view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"Disappear - ',
                            names[id - 1],
                            '", "description":"Commendetations for the Treasure Hunt **Disappear**, run at ETHBerlin4, Berlin."',
                            ',"image":"data:image/svg+xml,',
                            svg(id),
                            '","attributes":',
                            '[{"trait_type":"Position","value":"',
                            positions[id - 1],
                            '"},{"trait_type":"Treasure Hunt","value":"Disappear"},{"trait_type":"Host","value":"ETHBerlin4"},{"trait_type":"Location","value":"Berlin"}]}'
                        )
                    )
                )
            );
    }
}
