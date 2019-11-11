const path = require("path");
const { mkdirSync, readFileSync, writeFileSync } = require("fs");
const web3 = require("web3");
const b58 = require("base-58");
const THC = artifacts.require("./TreasureHuntCreator.sol");
const DIR_APP_CONTRACTS = "../app/src/contracts";

module.exports = function(deployer) {
  const chapters = JSON.parse(readFileSync(process.argv.pop()));
  var solutions = [];
  var quests = [];

  chapters.map(chapter => {
    const questHash = chapter["questHash"];
    const decoded = b58.decode(questHash);
    const quest = web3.utils.bytesToHex(decoded.slice(2));
    quests.push(quest);
    solutions.push(chapter["solutionAddress"]);
  });

  deployer.deploy(THC, solutions, quests).then(function() {
    const json = {
      abi: THC.abi,
      networks: THC.networks
    };
    try {
      mkdirSync(DIR_APP_CONTRACTS);
    } catch (e) {
      if (e.code !== "EEXIST") {
        throw e;
      }
    }
    writeFileSync(
      path.join(DIR_APP_CONTRACTS, "THC.json"),
      JSON.stringify(json, null, 2)
    );
  });
};
