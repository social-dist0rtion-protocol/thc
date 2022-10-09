// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TreasureHuntCreator is Ownable, AccessControl {
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");

    event ChapterCompleted(
        uint256 indexed completedChapter,
        address indexed player
    );

    uint256 constant PAGE_SIZE = 32;

    mapping(uint96 => address[]) public _chapterToPlayers;
    mapping(address => uint96) public _playerToCurrentChapter;
    mapping(address => uint8) public _keyToPos;
    mapping(address => uint80) public _playerToKeys;
    address[] public _solutions;
    address[] public _players;
    address[] public _gameMasters;

    bytes public _questsRootCid;

    constructor(
        address[] memory solutions,
        address[] memory keys,
        bytes memory questsRootCid
    ) {
        _solutions = solutions;
        _questsRootCid = questsRootCid;
        for (uint8 i; i < keys.length; i++) {
            // Add 1 otherwise it's impossible to know if the first key (index
            // 0) exists or not
            _keyToPos[keys[i]] = i + 1;
        }
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_MASTER_ROLE, msg.sender);
    }

    function setQuestsRootCID(bytes memory questsRootCid)
        external
        onlyRole(GAME_MASTER_ROLE)
    {
        _questsRootCid = questsRootCid;
    }

    function getQuestsRootCID() external view returns (bytes memory) {
        return _questsRootCid;
    }

    function addSolution(address solution) public onlyRole(GAME_MASTER_ROLE) {
        _solutions.push(solution);
    }

    function totalChapters() public view returns (uint256) {
        return _solutions.length;
    }

    function currentChapter() public view returns (uint96) {
        return _playerToCurrentChapter[msg.sender];
    }

    function submit(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        uint96 playerChapter = _playerToCurrentChapter[msg.sender];
        address playerChapterSolution = _solutions[playerChapter];
        bytes32 addressHash = getAddressHash(msg.sender);

        require(
            ecrecover(addressHash, v, r, s) == playerChapterSolution,
            "Wrong solution."
        );

        if (_playerToCurrentChapter[msg.sender] == 0) {
            _players.push(msg.sender);
        }
        _playerToCurrentChapter[msg.sender]++;
        _chapterToPlayers[playerChapter].push(msg.sender);
        emit ChapterCompleted(playerChapter, msg.sender);
    }

    function submitKey(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        address signer = ecrecover(getAddressHash(msg.sender), v, r, s);
        uint8 pos = _keyToPos[signer];
        require(pos > 0, "Wrong key");
        _playerToKeys[msg.sender] |= uint80(1 << (pos - 1));
    }

    function getAddressHash(address a) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n20", a));
    }

    // 160 bit address
    //   8 bit future use lol sure thing
    //  80 bit keys
    //   8 bit chapter
    function getLeaderboard(uint256 page)
        public
        view
        returns (uint256[PAGE_SIZE] memory leaderboard)
    {
        uint256 offset = page * PAGE_SIZE;
        for (
            uint256 i = 0;
            i < PAGE_SIZE && i + offset < _players.length;
            i++
        ) {
            address player = _players[i + offset];
            uint80 keys = _playerToKeys[player];

            leaderboard[i] =
                (uint256(uint160(player)) << 96) |
                (uint256(keys) << 8) |
                uint256(uint8(_playerToCurrentChapter[player]));
        }
    }
}
