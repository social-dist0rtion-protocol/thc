const web3 = require("web3");
const TreasureHuntCreator = artifacts.require("TreasureHuntCreator");

contract("TreasureHuntCreator test", async accounts => {

  it("should should initialize chapters with solutions", async() => {
    let instance = await TreasureHuntCreator.new(accounts);
    for(var i = 0; i < accounts.length; i++) {
      let solution = await instance._chapterIndexToSolution(i);
      assert.equal(solution.valueOf(), accounts[i]);
    }
  });
});

