const web3 = require("web3");
const fs = require("fs");

const THC = artifacts.require("./TreasureHuntCreator.sol");

module.exports = function(deployer) {
  deployer.deploy(THC, []).then(() => {
    /* try {
      fs.mkdirSync("../src/resources/contracts");
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
    const json = {
      abi: THC.abi,
      networks: THC.networks
    };
    fs.writeFileSync(
      "../src/resources/contracts/TreasureHuntCreator.json",
      JSON.stringify(json, null, 2)
    ); */
  });
};
