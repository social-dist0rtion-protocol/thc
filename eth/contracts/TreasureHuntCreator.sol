pragma solidity ^0.5.8;
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TreasureHuntCreator is Ownable {
  event ChapterCompleted(uint indexed completedChapter, address indexed player);

  mapping (uint256 => address[]) public _chapterToPlayers;
  mapping (address => uint256) public _playerToCurrentChapter;
  address[] public _solutions;
  address[] public _players;
  address[] public _gameMasters;
  bytes32[] public _quests;

  constructor(address[] memory solutions, bytes32[] memory quests) public {
    _solutions = solutions;
    _quests = quests;
  }

  modifier onlyGameMaster() {
    require(isGameMaster(), "Only game masters can use this function.");
    _;
  }

  modifier onlyPlayer() {
    require(_playerToCurrentChapter[msg.sender] >= 1, "Player did not join yet. Call 'join' first");
    _;
  }

  function isGameMaster() internal view returns (bool) {
    for(uint i; i < _gameMasters.length; i++) {
      if(_gameMasters[i] == msg.sender){
        return true;
      }
    }
    return false;
  }

  function addChapter(address solution, bytes32 nextQuest) public onlyGameMaster {
    _solutions.push(solution);
    _quests.push(nextQuest);
  }

  function addGameMaster(address gameMaster) public onlyOwner {
    for(uint i = 0; i < _gameMasters.length; i++) {
      require(_gameMasters[i] != gameMaster, "This game master has already been added");
    }

    _gameMasters.push(gameMaster);
  }

  function currentQuest() public view returns (bytes32) {
    uint currentChapterIndex = _playerToCurrentChapter[msg.sender];
    return _quests[currentChapterIndex];
  }

  function submit(uint8 v, bytes32 r, bytes32 s) public {
    uint256 currentChapter = _playerToCurrentChapter[msg.sender];
    address currentChapterSolution = _solutions[currentChapter];
    bytes32 addressHash = getAddressHash(msg.sender);

    require(ecrecover(addressHash, v, r, s) == currentChapterSolution, "Wrong solution.");

    if(_playerToCurrentChapter[msg.sender] == 0) {
      _players.push(msg.sender); 
    }
    _playerToCurrentChapter[msg.sender]++;
    _chapterToPlayers[currentChapter].push(msg.sender);
    emit ChapterCompleted(currentChapter, msg.sender);
  }

  function getAddressHash(address a) pure public returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n20", a));
  }
}
