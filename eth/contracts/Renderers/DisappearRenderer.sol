// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DisappearRenderer is Ownable {
    string constant template0 =
        "<svg width='100%' height='100%' viewBox='0 0 600 600' style='background: black'> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.95) translate(16, 3)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.90) translate(33, 6)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.85) translate(53, 9)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.80) translate(75, 13)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.75) translate(100, 17)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.70) translate(128, 22)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.65) translate(161, 27)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.60) translate(200, 34)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.55) translate(244, 42)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.50) translate(300, 51)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.45) translate(366, 63)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.40) translate(451, 77)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.35) translate(558, 96)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.30) translate(700, 122)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.25) translate(897, 158)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.20) translate(1200, 212)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.15) translate(1700, 300)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.10) translate(2701, 490)' stroke-width='0.5' /> <path stroke='red' d='M 120 220 C 120 -20, 470 -20 480 220 C 480 300, 450 440, 300 550 C 150 440, 120 300, 120 220' fill='transparent' transform='scale(0.05) translate(5701, 1040)' stroke-width='0.5' /> <g opacity='1' id='smiley'> <circle cx='300' cy='180' r='100' fill='red' /> <circle cx='265' cy='155' r='15' fill='black' /> <circle cx='335' cy='155' r='15' fill='black' />";
    string constant template1 =
        "<path stroke='black' d='M 250 210 C 275 240, 325 240, 350 210' stroke-width='13' stroke-linecap='round' fill='transparent' /> </g> </svg>";

    string constant patch =
        "<path stroke='#000000' d='M 258 90 L 335 155 L 396 155' stroke-linecap='round' fill='transparent' stroke-width='3px' />";
    bytes constant gold =
        abi.encodePacked(
            patch,
            "<circle cx='335' cy='155' r='19' fill='#ffdf27' stroke='#000000' stroke-width='3px' />"
        );
    bytes constant silver =
        abi.encodePacked(
            patch,
            "<circle cx='335' cy='155' r='19' fill='#b8b8b8' stroke='#000000' stroke-width='3px' />"
        );
    bytes constant bronze =
        abi.encodePacked(
            patch,
            "<circle cx='335' cy='155' r='19' fill='#af6007' stroke='#000000' stroke-width='3px' />"
        );
    bytes constant keys =
        "<path stroke='#000000' d='M 203 150 L 265 155 L 335 155 L 397 150' stroke-linecap='round' fill='transparent' stroke-width='3px' /> <circle cx='265' cy='155' r='19' fill='#ffffff' stroke='black' stroke-width='3px' /> <circle cx='335' cy='155' r='19' fill='#ffffff' stroke='black' stroke-width='3px' />";

    string[4] names = ["Gold", "Silver", "Bronze", "Investigator"];
    string[4] positions = ["1st", "2nd", "3rd", "Nth"];

    function svg(uint256 id) internal pure returns (bytes memory) {
        if (id == 1) {
            return abi.encodePacked(template0, gold, template1);
        }
        if (id == 2) {
            return abi.encodePacked(template0, silver, template1);
        }
        if (id == 3) {
            return abi.encodePacked(template0, bronze, template1);
        }
        if (id == 4) {
            return abi.encodePacked(template0, keys, template1);
        }

        return "";
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
