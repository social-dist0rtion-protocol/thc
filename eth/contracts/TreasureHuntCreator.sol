// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.12 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasureHuntCreator is Ownable {
    event ChapterCompleted(
        uint indexed completedChapter,
        address indexed player
    );

    uint constant PAGE_SIZE = 32;

    mapping(uint96 => address[]) public _chapterToPlayers;
    mapping(address => uint96) public _playerToCurrentChapter;
    address[] public _solutions;
    address[] public _players;
    address[] public _gameMasters;
    
    bytes public _questsRootCid;

    constructor(address[] memory solutions, bytes memory questsRootCid) {
        _solutions = solutions;
        _questsRootCid = questsRootCid;
    }

    modifier onlyGameMaster() {
        require(isGameMaster(), "Only game masters can use this function.");
        _;
    }

    modifier onlyPlayer() {
        require(
            _playerToCurrentChapter[msg.sender] >= 1,
            "Player did not join yet. Call 'join' first"
        );
        _;
    }

    function isGameMaster() internal view returns (bool) {
        for (uint i; i < _gameMasters.length; i++) {
            if (_gameMasters[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function setQuestsRootCID(bytes memory questsRootCid) external onlyGameMaster {
        _questsRootCid = questsRootCid;
    }

    function getQuestsRootCID() external view returns (bytes memory) {
        return _questsRootCid;
    }

    function addSolution(address solution)
        public
        onlyGameMaster
    {
        _solutions.push(solution);
    }

    function addGameMaster(address gameMaster) public onlyOwner {
        for (uint i = 0; i < _gameMasters.length; i++) {
            require(
                _gameMasters[i] != gameMaster,
                "This game master has already been added"
            );
        }

        _gameMasters.push(gameMaster);
    }

    function totalChapters() public view returns (uint) {
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

    function getAddressHash(address a) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n20", a));
    }

    function getLeaderboard(uint page)
        public
        view
        returns (uint256[PAGE_SIZE] memory leaderboard)
    {
        uint offset = page * PAGE_SIZE;
        for (uint i = 0; i < PAGE_SIZE && i + offset < _players.length; i++) {
            address player = _players[i + offset];

            leaderboard[i] =
                (uint256(uint160(player)) << 96) |
                uint256(_playerToCurrentChapter[player]);
        }
    }
}
