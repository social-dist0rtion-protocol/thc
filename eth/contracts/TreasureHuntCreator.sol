pragma solidity ^0.5.8;
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TreasureHuntCreator is Ownable {
   event ChapterCompleted(uint indexed completedChapter, address indexed player);

   mapping (address => address[]) public _solutionToPlayers;
   mapping (address => uint) public _playerToCurrentChapterIndex;
   mapping (uint => address) public _chapterIndexToSolution;
   address[] public _solutions;
   address[] public _players;

   constructor(address[] memory solutions) public {
      _solutions = solutions;
      for(uint i = 0; i < _solutions.length; i++) {
        _chapterIndexToSolution[i] = _solutions[i];
      }
   }

   function join() public {
      _players.push(msg.sender);
      _playerToCurrentChapterIndex[msg.sender] = 1;
   }

   function submit(uint8 v, bytes32 r, bytes32 s) public {
      require(_playerToCurrentChapterIndex[msg.sender] >= 1);
      address currentChapter = _chapterIndexToSolution[_playerToCurrentChapterIndex[msg.sender]];
      bytes32 challengeHash = bytes32(uint256(keccak256(abi.encodePacked(msg.sender))));
      require(ecrecover(challengeHash, v, r, s) == currentChapter);

      uint completedChapter = _playerToCurrentChapterIndex[msg.sender];
      _playerToCurrentChapterIndex[msg.sender]++;
      _solutionToPlayers[currentChapter].push(msg.sender);
      emit ChapterCompleted(completedChapter, msg.sender);
   }
}
