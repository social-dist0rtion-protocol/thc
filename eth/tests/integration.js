const web3 = require("web3");
const ethers = require("ethers");
const TreasureHuntCreator = artifacts.require("TreasureHuntCreator");

contract("TreasureHuntCreator test", async accounts => {

  it("should initialize chapters with solutions", async() => {
    let instance = await TreasureHuntCreator.new(accounts);
    for(var i = 0; i < accounts.length; i++) {
      let solution = await instance._chapterIndexToSolution(i);
      assert.equal(solution.valueOf(), accounts[i]);
    }
  });

  it("should increment the user chapter upon successful submission", async() => {
    let testSolution = "A solution.";
    let currentAccount = accounts[0];
    let solutionBytes = ethers.utils.toUtf8Bytes(testSolution);
    let solutionDigest = ethers.utils.keccak256(solutionBytes);
    let wallet = new ethers.Wallet(solutionDigest);
    let signature = await wallet.signMessage(ethers.utils.arrayify(currentAccount));
    let {r, v, s} = ethers.utils.splitSignature(signature);

    let instance = await TreasureHuntCreator.new([wallet.address]);
    instance.join({"from": currentAccount});
    instance.submit(v, r, s, {"from": currentAccount});

    let result = await instance._playerToCurrentChapter(currentAccount);
    assert.equal(result, 2);
  });

  it("should fail upon unsuccessful submission", async() => {
  });

  it("should not increment any counter upon unsuccessful submission", async() => {
  });

  it("should add the player to the solved chapter", async() => {
  });
});

