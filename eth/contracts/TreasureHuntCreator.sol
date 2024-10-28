// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {ITreasure} from "./ITreasure.sol";
import {GelatoRelayContextERC2771} from "@gelatonetwork/relay-context/contracts/GelatoRelayContextERC2771.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreasureHuntCreator is
    Ownable,
    AccessControl,
    GelatoRelayContextERC2771
{
    using Address for address payable;
    mapping(address => uint256) public contextCounter;
    event IncrementCounter(address msgSender);
    event PrizeMinted(address from, uint256 badgeId);

    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");

    event ChapterCompleted(
        address indexed player,
        uint256 indexed completedChapter
    );

    event KeyCompleted(address indexed player, uint256 indexed completedKey);

    uint256 constant PAGE_SIZE = 32;

    mapping(uint96 => address[]) public chapterToPlayers;
    mapping(address => uint64) public playerToCurrentChapter;
    mapping(address => uint32) public playerToRelativeTimestamp;
    mapping(address => uint8) public keyToPos;
    mapping(address => uint80) public playerToKeys;
    uint8 public totalKeys;
    address[] public solutions;
    address[] public players;
    address[] public gameMasters;

    // timestamp of the first succesful submission
    uint256 public startTimestamp;

    bytes public questsRootCid;
    ITreasure public prize;

    constructor(
        address[] memory solutions_,
        address[] memory keys,
        address prize_
    ) {
        solutions = solutions_;
        prize = ITreasure(prize_);
        for (uint8 i; i < keys.length; i++) {
            // Add 1 otherwise it's impossible to know if the first key (index
            // 0) exists or not
            keyToPos[keys[i]] = i + 1;
        }
        totalKeys = uint8(keys.length);
        _grantRole(DEFAULT_ADMIN_ROLE, _getMsgSender());
        _grantRole(GAME_MASTER_ROLE, _getMsgSender());
    }

    function setup(
        bytes memory questsRootCid_
    ) external onlyRole(GAME_MASTER_ROLE) {
        questsRootCid = questsRootCid_;

        require(
            prize.hasRole(prize.TREASURE_HUNT_ROLE(), address(this)),
            "Game not verified yet"
        );
    }

    function getQuestsRootCID() external view returns (bytes memory) {
        return questsRootCid;
    }

    function addSolution(address solution) public onlyRole(GAME_MASTER_ROLE) {
        solutions.push(solution);
    }

    function totalChapters() public view returns (uint256) {
        return solutions.length;
    }

    function currentChapter() public view returns (uint96) {
        return playerToCurrentChapter[_getMsgSender()];
    }

    function submit(uint8 v, bytes32 r, bytes32 s) public {
        if (startTimestamp == 0) {
            startTimestamp = block.timestamp;
        }

        uint96 playerChapter = playerToCurrentChapter[_getMsgSender()];
        address playerChapterSolution = solutions[playerChapter];
        bytes32 addressHash = getAddressHash(_getMsgSender());

        require(
            ecrecover(addressHash, v, r, s) == playerChapterSolution,
            "Wrong solution."
        );

        if (playerToCurrentChapter[_getMsgSender()] == 0) {
            players.push(_getMsgSender());
        }
        playerToCurrentChapter[_getMsgSender()]++;
        playerToRelativeTimestamp[_getMsgSender()] = uint32(
            block.timestamp - startTimestamp
        );
        chapterToPlayers[playerChapter].push(_getMsgSender());
        _rewardMain(playerChapter, _getMsgSender());

        emit ChapterCompleted(_getMsgSender(), playerChapter);

        if (_isGelatoRelayERC2771(msg.sender)) {
            _transferRelayFee();
        }
    }

    function submitKey(uint8 v, bytes32 r, bytes32 s) public {
        address signer = ecrecover(getAddressHash(_getMsgSender()), v, r, s);
        uint8 pos = keyToPos[signer];
        require(pos > 0, "Wrong key");
        playerToKeys[_getMsgSender()] |= uint80(1 << (pos - 1));
        _rewardKeys(playerToKeys[_getMsgSender()], _getMsgSender());

        emit KeyCompleted(_getMsgSender(), pos - 1);

        if (_isGelatoRelayERC2771(msg.sender)) {
            _transferRelayFee();
        }
    }

    function getAddressHash(address a) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n20", a));
    }

    function _rewardMain(uint256 chapter, address player) internal {
        if (chapter == totalChapters() - 1) {
            uint256 peopleInThisChapter = chapterToPlayers[uint96(chapter)]
                .length;
            uint256 position = peopleInThisChapter > 3
                ? 4
                : peopleInThisChapter;
            prize.mint(player, position);
            emit PrizeMinted(player, position);
        }
    }

    function _rewardKeys(uint256 keys, address player) internal {
        if (keys == 2 ** totalKeys - 1) {
            prize.mint(player, 5);
            emit PrizeMinted(player, 5);
        }
    }

    // 160 bit address
    //   8 bit future use lol sure thing
    //  80 bit keys
    //   8 bit chapter
    function getLeaderboard(
        uint256 page
    ) public view returns (uint256[PAGE_SIZE] memory leaderboard) {
        uint256 offset = page * PAGE_SIZE;
        for (uint256 i = 0; i < PAGE_SIZE && i + offset < players.length; i++) {
            address player = players[i + offset];
            uint80 keys = playerToKeys[player];

            leaderboard[i] =
                (uint256(uint160(player)) << 96) |
                (uint256(keys) << 8) |
                uint256(uint8(playerToCurrentChapter[player]));
        }
    }

    receive() external payable {}

    fallback() external payable {}

    function withdrawERC20(
        IERC20 token,
        address receiver
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        bool result = token.transfer(receiver, token.balanceOf(address(this)));
        require(result, "Transfer failed");
    }

    function withdraw(
        address payable receiver
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool sent, ) = receiver.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
