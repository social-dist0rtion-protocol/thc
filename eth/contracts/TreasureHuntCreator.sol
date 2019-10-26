pragma solidity ^0.5.8;
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TreasureHuntCreator is Ownable {
   event ChapterCompleted(uint indexed completedChapter, address indexed player);

   mapping (uint256 => address[]) public _chapterIndexToPlayers;
   mapping (address => uint256) public _playerToCurrentChapter;
   mapping (uint256 => address) public _chapterIndexToSolution;
   address[] public _solutions;
   address[] public _players;
   address[] public _gameMasters;

   constructor(address[] memory solutions) public {
      _solutions = solutions;
      for(uint i = 0; i < _solutions.length; i++) {
        _chapterIndexToSolution[i] = _solutions[i];
      }
   }

   function addGameMaster(address gameMaster) public {
      for(uint i = 0; i < _gameMasters.length; i++) {
        require(_gameMasters[i] != gameMaster, "This game master has already been added");
      }

      _gameMasters.push(gameMaster);
   }

   function join() public {
      require(_playerToCurrentChapter[msg.sender] == 0, "Player already joined the game");
      _players.push(msg.sender);
      _playerToCurrentChapter[msg.sender] = 1;
   }

   function submit(uint8 v, bytes32 r, bytes32 s) public {
      require(_playerToCurrentChapter[msg.sender] >= 1, "Player did not join yet. Call 'join' first");
      uint256 currentChapter = _playerToCurrentChapter[msg.sender];
      uint256 currentChapterIndex = currentChapter - 1;
      address currentChapterSolution = _chapterIndexToSolution[currentChapterIndex];
      bytes32 addressHash = getAddressHash(msg.sender);

      require(ecrecover(addressHash, v, r, s) == currentChapterSolution, "Wrong solution.");

      _playerToCurrentChapter[msg.sender]++;
      _chapterIndexToPlayers[currentChapterIndex].push(msg.sender);
      emit ChapterCompleted(currentChapter, msg.sender);
   }

   function getAddressHash(address a) pure public returns (bytes32) {
     return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n20", a));
   }
}
