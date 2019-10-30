const web3 = require("web3");
const b58 = require("base-58");
const CHAPTERS = require("./chapters.json");
const THC = artifacts.require("./TreasureHuntCreator.sol");

module.exports = function(deployer) {
  var solutions = [];
  var quests = [];

  CHAPTERS.map(chapter => {
    var questAddress = chapter["quest"];
    var contentHash = questAddress.split("/").pop();
    var decoded = b58.decode(contentHash);
    var quest = web3.utils.bytesToHex(decoded.slice(2));
    quests.push(quest);
    solutions.push(chapter["solution"]);
  });

  deployer.deploy(THC, solutions, quests).then(function() {});
};
