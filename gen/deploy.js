const web3 = require("web3");
const CHAPTER_FILE = process.argv[2];

const config = require(`./${CHAPTER_FILE}`);

async function deployChapter(quest, solution) {
  var myContract = new web3.eth.Contract(
    "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    {
      from: "0x1234567890123456789012345678901234567891", // default from address
      gasPrice: "20000000000" // default gas price in wei, 20 gwei in this case
    }
  );
}

config.forEach(async function(chapter) {
  var quest = chapter["quest"];
  var solution = chapter["solution"];

  await deployChapter(quest, solution);
});
