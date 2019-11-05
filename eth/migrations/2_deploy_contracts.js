const { readFileSync } = require("fs");
const web3 = require("web3");
const b58 = require("base-58");
const THC = artifacts.require("./TreasureHuntCreator.sol");

module.exports = function(deployer) {
  const chapters = JSON.parse(readFileSync(process.argv.pop()));
  console.log(chapters);
  var solutions = [];
  var quests = [];

  chapters.map(chapter => {
    const questHash = chapter["questHash"];
    const decoded = b58.decode(questHash);
    const quest = web3.utils.bytesToHex(decoded.slice(2));
    quests.push(quest);
    solutions.push(chapter["solutionAddress"]);
  });

  deployer.deploy(THC, solutions, quests).then(function() {});
};
